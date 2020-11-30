import 'firebase/firestore'
import {map,size} from 'lodash'
import {FireSQL} from 'firesql'
import uuid from 'random-uuid-v4'
import * as firebase from 'firebase'
import {Platform} from 'react-native'
import {firebaseapp} from './firebas'
import Constants from 'expo-constants'
import {convertirFicheroBlob} from './utils'
import * as Permissions from 'expo-permissions'
import * as Notifications from 'expo-notifications'

const db = firebase.firestore(firebaseapp)
const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" })

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export const reauthenticate = (password) =>{
  const user = firebase.auth().currentUser
  const credentials = firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  )
  return user.reauthenticateWithCredential(credentials)
}

export const validarsesion = (setvalidarsesion) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setvalidarsesion(true)
    } else {
      setvalidarsesion(false)
    }
  })
}

export const cerrarsesion = () => {
  firebase.auth().signOut();
}

export const validarPhone = (setphoneauth) => {
  db.collection("Usuarios")
  .doc(ObtenerUsuario().uid)
  .onSnapshot((snapshot) => {
    setphoneauth(snapshot.exists)
  })
}

export const enviarconfirmacionphone = async (numero, recapcha) => {
  let verificationid = "";

  await firebase
    .auth()
    .currentUser.reauthenticateWithPhoneNumber(numero, recapcha.current)
    .then((response) => {
      verificationid = response.verificationId;
    })
    .catch((err) => console.log(err));

  return verificationid;
}

export const reConfirmarcodigo = async (verificationid, codigo) => {
  let resultado = false;
  const credenciales = firebase.auth.PhoneAuthProvider.credential(
    verificationid,
    codigo
  )
  await firebase
    .auth()
    .currentUser.updatePhoneNumber(credenciales)
    .then((response) => (resultado = true))
    .catch((err) => {
      console.log(err);
    })
  return resultado;
}

export const confirmarcodigo = async (verificationid, codigo) => {
  let resultado = false;
  const credenciales = firebase.auth.PhoneAuthProvider.credential(
    verificationid,
    codigo
  )
  await firebase
    .auth()
    .currentUser.linkWithCredential(credenciales)
    .then((response) => (resultado = true))
    .catch((err) => {
      console.log(err);
    });

  return resultado;
}

export const obtenerToken = async () => {
  let token = "";
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return token;
};

export const ObtenerUsuario = () => {
  return firebase.auth().currentUser;
};

export const addRegistroEspecifico = async (coleccion, doc, data) => {
  const resultado = { error: "", statusreponse: false };

  await db
    .collection(coleccion)
    .doc(doc)
    .set(data, { merge: true })
    .then((response) => {
      resultado.statusreponse = true;
    })
    .catch((err) => {
      resultado.error = err;
    });

  return resultado;
};

export const subirImagenesBatch = async (imagenes, ruta) => {
  const imagenesurl = []
  await Promise.all(
    map(imagenes, async (image) => {
      const blob = await convertirFicheroBlob(image)
      const ref = firebase.storage().ref(ruta).child(uuid())
      await ref.put(blob).then(async (result) => {
        await firebase
          .storage()
          .ref(`${ruta}/${result.metadata.name}`)
          .getDownloadURL()
          .then((imagenurl) => { 
            imagenesurl.push(imagenurl)
          })
      })
    })
  )
  return imagenesurl
}

export const subirEditarImagenesBatch = async (imagenes,ruta) => {
  const imagenesEnv = []
  await Promise.all(
    map(imagenes, async (image) => {
      if(image.status){
        imagenesEnv.push(image.imagen)
      }else{
        const blob = await convertirFicheroBlob(image.imagen)
        const ref = firebase.storage().ref(ruta).child(uuid())
        await ref.put(blob).then(async (result) => {
          await firebase
            .storage()
            .ref(`${ruta}/${result.metadata.name}`)
            .getDownloadURL()
            .then(async(imagenurl) => {
              await imagenesEnv.push(imagenurl)
            })
            .catch((error) => {
              console.log(error)
            })
        })
      }
    })
  )
  return imagenesEnv
}

export const verificarImagenes = async (imagenesR,imagenesE) => {
  const imagenesUrl = []
  await Promise.all(
    map(imagenesE, async (image) => {
      let response = {imagen:image,status:false}
      map(imagenesR, async (imageR) => {
        if(image === imageR){
          response.status=true
        }
      })
      imagenesUrl.push(response)
    })
  )
  return imagenesUrl
}

export const verificarArray = async (array,dato) => {
  
  //console.log("value",dato)
  //console.log("listProduct",array)
  let verificador = false

  await Promise.all(
    map(array, async (a) => {
      if(a===dato){
        return verificador = true
      }
    })
  )
  return verificador
}

export const verificarLista = async (array) => {
  let arrayE = []
  const list = await ListarProductos()
  let cont = 0
  await Promise.all(
    map(array, async (a) => {
      map(list, async (b) => {
        if(a === b.id){
          b.posicion = cont
          arrayE.push(b)
        }
      })
      cont = cont+1
    })
  )
  return arrayE
}

export const verificarImagenesEliminar = async (imagenesR,imagenesE) => {
  const imagenesUrl = []
  await Promise.all(
    map(imagenesR, async (imageR) => {
      let response = true
      map(imagenesE, async (imageE) => {
        if(imageR === imageE){
          response = false
        }
      })
      if(response){
        imagenesUrl.push(imageR)
      }
    })
  )
  return imagenesUrl
}

export const datos = async (array,cantidad,id) =>{
  let cont = 1
  let subt = 0
  let items = []
  for (let index = 0; index < size(array); index++) {
    subt = (subt+(array[index].precio*cantidad[index]))
    let item = {
      numero: cont,
      id: array[index].id,
      cantidad: cantidad[index],
      nombre: array[index].titulo,
    }
    items.push(item)
    cont++
  }
  let iv = Number((subt * 0.12).toFixed(2))
  let tot = subt + iv

  let valor = {
    iva: iv,
    numero: 0,
    total: tot,
    usuario: id,
    items: items,
    subtotal: subt,
    estado: "pendiente",
    fechacreacion: new Date(),
  }
  
  return valor
}

export const actualilzarPerfil = async (data) => {
  let respuesta = false;
  await firebase
    .auth() 
    .currentUser.updateProfile(data)
    .then((response) => {
      respuesta = true;
    });
  return respuesta;
};

export const reautenticar = async (verificationId, code) => {
  let response = { statusresponse: false };

  const credenciales = new firebase.auth.PhoneAuthProvider.credential(
    verificationId,
    code
  );

  await firebase
    .auth()
    .currentUser.reauthenticateWithCredential(credenciales)
    .then((resultado) => (response.statusresponse = true))
    .catch((err) => {
      console.log(err);
    });

  return response;
};

export const actualizaremailfirebase = async (email) => {
  let response = { statusresponse: false };
  await firebase
    .auth()
    .currentUser.updateEmail(email)
    .then((respuesta) => {
      response.statusresponse = true;
    })
    .catch((err) => (response.statusresponse = false));
  return response;
};

export const addRegistro = async (colecion, data) => {
  const resultado = { error: "", statusreponse: false };

  await db
    .collection(colecion)
    .add(data)
    .then((response) => {
      resultado.statusreponse = true;
    })
    .catch((err) => {
      resultado.error = err;
    })
  return resultado
}

export const ListarMisProductos = async () => {
  let productos = [];
  await db
    .collection("productos")
    .where("usuario", "==", ObtenerUsuario().uid)
    //.where("status", "==", 1)
    .get()
    .then((response) => {
      response.forEach((doc) => {
        const producto = doc.data();
        producto.id = doc.id;
        productos.push(producto);
      });
    })
    .catch((err) => {
      console.log("error");
    });

  return productos;
}

export const numberOrden = async () => {
  let cantidad = 0
  let orden = []
  await db
    .collection("orden")
    .get()
    .then((response) => {
      response.forEach((doc) => {
        const ord = doc.data()
        orden.push(ord)
      })
    })
    .catch((err) => {
      console.log("error");
    })
    cantidad = size(orden)+1
  return cantidad
}

export const actualizarRegistro = async (coleccion, documento, data) => {
  let response = { statusresponse: false };
  await db
    .collection(coleccion)
    .doc(documento)
    .update(data)
    .then((result) => (response.statusresponse = true))
    .catch((err) => console.log(err));
  return response;
}

export const eliminarImagenes = async (coleccion, imagenes) => {
  let response = { statusresponse: false }
  await Promise.all(
    map(imagenes, async (image) => {
      console.log("imagen",image)
      const n = image.split('%2F').pop().split('#').shift().split('?').shift()
      console.log("recortada",n)
      const ref = firebase.storage().ref(coleccion).child(n)
      await ref.delete().then(function() {
        response.statusresponse = true
        console.log("eliminado correctamente")
      }).catch(function(error) {
        console.log(error)
      })
    })
  )
  return response
}

export const eliminarProducto = async (coleccion, documento) => {
  let response = { statusresponse: false };
  await db
    .collection(coleccion)
    .doc(documento)
    .delete()
    .then((result) => (response.statusresponse = true))
    .catch((err) => {
      console.log(err);
    })

  return response;
}

export const obtenerDatosUsuario = async (documento) => {
  let response = {}
  await db
    .collection("users")
    .doc(documento)
    .get()
    .then((result) => {
      response = result.data()
    })
    .catch((err) => {
      console.log(err)
    })
  return response
}

export const obternerRegistroxID = async (coleccion, documento) => {
  let response = { statusresponse: false, data: null };
  await db
    .collection(coleccion)
    .doc(documento)
    .get()
    .then((result) => {
      const producto = result.data();
      producto.id = result.id;
      response.data = producto;
      response.statusresponse = true;
    })
    .catch((err) => {
      console.log(err);
    });
  return response;
};

export const ListarProductos = async () => {
  const productoslist = []
  let index = 0
  await db
    .collection("productos")
    .where("status", "==", 1)
    .get()
    .then((response) => {
      response.forEach((doc) => {
        const producto = doc.data()
        producto.id = doc.id
        productoslist.push(producto)
      })
    })
    .catch((err) => console.log(err))
    for (const registro of productoslist) {
      const usuario = await obtenerDatosUsuario(registro.usuario)
      productoslist[index].token = usuario.token
      productoslist[index].nombre = usuario.nombre
      index++
    }
  return productoslist
}

export const listarProductosxCategoria = async (categoria) => {
  const productoslist = []
  let index = 0
  await db
    .collection("productos")
    .where("status", "==", 1)
    .where("categoria", "==", categoria)
    .get()
    .then((response) => {
      response.forEach((doc) => {
        const producto = doc.data()
        producto.id = doc.id
        productoslist.push(producto)
      })
    })
    .catch((err) => console.log(err))
  for (const registro of productoslist) {
    const usuario = await obtenerDatosUsuario(registro.usuario)
    productoslist[index].token = usuario.token
    productoslist[index].nombre = usuario.nombre
    index++
  }
  return productoslist
}

export const Buscar = async (search) => {
  let productos = []
  await fireSQL
    .query(`SELECT * FROM productos WHERE titulo LIKE '${search}%' `)
    .then((response) => {
      productos = response
    })
  return productos
}

export const iniciarnotificaciones = (
  notificationListener,
  responseListener
) => {
  notificationListener.current = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log(notification);
    }
  );

  responseListener.current = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log(response);
    }
  );

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};

export const sendPushNotification = async (mensaje) => {
  let respuesta = false;
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mensaje),
  }).then((response) => {
    respuesta = true;
  });

  return respuesta;
};

export const setMensajeNotificacion = (token, titulo, body, data) => {
  const message = {
    to: token,
    sound: "default",
    title: titulo,
    body: body,
    data: data,
  }
  return message;
}

export const ListarNotificaciones = async () => {
  let respuesta = { statusresponse: false, total: 0 }
  //let index = 0
  await db
    .collection("orden")
    .where("estado", "==", "pendiente")
    .get()
    .then((response) => {
      let num = 0
      response.forEach((doc) => {
        num = num + 1
      })
      respuesta.total = num
      respuesta.statusresponse = true
    })
  return respuesta
}

export const ListarOrdenes = async () => {
  let respuesta = { statusresponse: false, data: [] }
  let index = 0;
  await db
    .collection("orden")
    .where("estado", "==", "pendiente")
    .get()
    .then((response) => {
      let datos
      response.forEach((doc) => {
        datos = doc.data()
        datos.id = doc.id
        respuesta.data.push(datos)
      })
      respuesta.statusresponse = true
    })

  for (const notificacion of respuesta.data) {
    const usuario = await obtenerDatosUsuario(notificacion.usuario)
    respuesta.data[index].user = usuario
    index++
  }

  return respuesta;
}
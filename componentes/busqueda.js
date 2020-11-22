import React,{useEffect} from 'react'
import {Buscar} from '../utils/acciones'
import {SearchBar} from 'react-native-elements'

export default function Busqueda(props) {
    const {search,setsearch,setmensajes,setproductlist,actualizarProductos} = props

    useEffect(() => {
        let resultados = []
        if (search) {
            (async () => {
                resultados = await Buscar(search)
                setproductlist(resultados)
                if (resultados.length === 0) {
                    setmensajes("No se encontraron datos para la búsqueda " + search)
                }
            })()
        }
    }, [search])

    return (
        <SearchBar
            placeholder="¿Qué estás Buscando?"
            containerStyle={{
                borderTopColor: "transparent",
                backgroundColor: "transparent",
                borderBottomColor: "transparent",
            }}
            inputContainerStyle={{
                alignItems: "center",
                backgroundColor: "#fff",
            }}
            inputStyle={{ fontFamily: "Roboto", fontSize: 20 }}
            onChangeText={(text) => {setsearch(text)}}
            value={search}
            onClear={() => {
                setsearch("")
                setproductlist([])
                actualizarProductos()
            }}
        />
    )
}
import React from 'react'
import {size} from 'lodash'
import {View,Image} from 'react-native'
import Carousel,{Pagination} from 'react-native-snap-carousel'

export default function CarouselImages(props) {
    const {width,height,imagenes,activeslide,setactiveslide} = props;

    const renderItem = ({ item }) => {
        return (
            <Image
                resizeMode="stretch"
                source={{ uri: item }}
                style={{ width, height }}
            />
        )
    }
    return (
        <View>
            <Carousel
                data={imagenes}
                itemWidth={width}
                layout={"default"}
                sliderWidth={width}
                renderItem={renderItem}
                onSnapToItem={(index) => setactiveslide(index)}
            />
            <Paginacion data={imagenes} activeslide={activeslide} />
        </View>
    )
}

function Paginacion(props) {
    const { data, activeslide } = props;
    return (
        <Pagination
            dotsLength={size(data)}
            activeDotIndex={activeslide}
            containerStyle={{
                zIndex: 1,
                bottom: 40,
                alignSelf: "center",
                position: "absolute",
                backgroundColor: "transparent",
            }}
            dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 2,
                backgroundColor: "#25d366",
            }}
            inactiveDotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 2,
                backgroundColor: "#128C7E",
            }}
            inactiveDotOpacity={0.6}
            inactiveDotScale={0.6}
        />
    )
}
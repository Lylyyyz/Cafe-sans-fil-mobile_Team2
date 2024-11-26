/* Cette page s'occupera du onboarding process (images qui se suivent avec des bouttons next et précendent)
à la dernière image, on push avec router vers la page login
*/

import {View,
	Text,
	Image,
	Animated,
	Dimensions,
	PanResponder,
	TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView}
from 'react-native';

import { FONTS } from '../static/theme';
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'expo-router';

import AntDesign from '@expo/vector-icons/AntDesign';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");


// Première page avec image + text
function Page1(){
    return(
    //<ScrollView>
        <View style={styles.pageContainer}>
            <View style={styles.imageContainer}>
                <Image source={require('../assets/images/onboarding_images/page1.jpg')} style={styles.image}
                resizeMode='contain'/>
            </View>
        </View>
    //</ScrollView>
    );
}

// Deuxième page avec image + text
function Page2(){
    return(
        <View style={styles.pageContainer}>
            <View style={styles.imageContainer}>
                <Image source={require('../assets/images/onboarding_images/page2.jpg')} style={styles.image}
                resizeMode='contain'/>
            </View>
        </View>

    );
}

// Troisième page avec image + text + boutton qui redirige vers login page
function Page3(){
    return(
        <View style={styles.pageContainer}>
            <View style={styles.imageContainer}>
                <Image source={require('../assets/images/onboarding_images/page3.jpg')} style={styles.image}
                resizeMode='contain'/>
            </View>
        </View>
    );
}

function Page4(){
    const router = useRouter();
    return(
        <View style={styles.pageContainer}>
            <Text style={{textAlign:'center', padding: 10}}>Du texte indiquant la fin du onboarding process...
                (et peut-être une image)
            </Text>
            <TouchableOpacity onPress={() => {router.push("/login")}} style={styles.centerButton}>
                <Text style={styles.textButton}>
                    Go to Login
                </Text>
            </TouchableOpacity>
        </View>
    );
}



// fonction qui va tout assembler en un
// on ira de page en page en slidant vers la droite ou la gauche (avancer ou reculer)
// ce serait nice d'avoir une sorte de progress bar en haut.
export default function OnBoarding() {
    const [currentPage, setCurrentPage] = useState(0);
	const translateX = useRef(new Animated.Value(0)).current;

	// Détecter le swipe avec PanResponder
	const panResponder = PanResponder.create({
		onMoveShouldSetPanResponder: () => true,
		onPanResponderRelease: (event, gestureState) => {
			const { dx } = gestureState;

			// Déterminer la direction du swipe
			const direction = dx < -50 ? 1 : dx > 50 ? -1 : 0;

			if (direction !== 0) {
				setCurrentPage((prevPage) => {
					const nextPage = Math.max(0, Math.min(prevPage + direction, 3)); // Limiter entre 0 et 1
					return nextPage;
				});
			}
		},
	});

    // Mise à jour de translateX pour afficher la page courante
	useEffect(() => {
		Animated.spring(translateX, {
			toValue: -currentPage * screenWidth,
			useNativeDriver: true,
			bounciness: 0,
		}).start();
	}, [currentPage]);

	React.useEffect(() => {
		Animated.spring(translateX, {
			toValue: -currentPage * screenWidth,
			useNativeDriver: true,
			bounciness: 0,
		}).start();
	}, [currentPage]);

    return(
        <ScrollView>
            <SafeAreaView
                style={{
                    backgroundColor: 'white',
                    alignItems: "flex-start",
                }}>
                <Animated.View
                    style={{
                        flexDirection: "row",
                        width: screenWidth * 4,
                        transform: [{ translateX }],
                    }}
                    {...panResponder.panHandlers}>
                    <Page1/>
                    <Page2/>
                    <Page3/>
                    <Page4/>
                </Animated.View>
                {/* progress bar */}
                <View style={styles.barContainer}>
                    {/* si le current page est egal à la page --> le boutton est actif*/}
                    {/* <LeftArrow width={40} height={40}/> */}
                    <TouchableOpacity 
                        onPress={() => {
                        if (currentPage >= 1) setCurrentPage(prevCurrentPage => prevCurrentPage - 1)}}
                    >
                        <AntDesign name="left" size={30} color="blue" style={styles.arrowSVG}/>
                    </TouchableOpacity>                    
                    <View style={styles.barButtons}>
                        <TouchableOpacity style={currentPage === 0 ?  styles.progressActive : styles.progressInactive}
                        onPress={() => {
                            setCurrentPage(0)}}
                        >
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={currentPage === 1 ?  styles.progressActive : styles.progressInactive}
                        onPress={() => {
                            setCurrentPage(1)}}
                        >
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={currentPage === 2 ?  styles.progressActive : styles.progressInactive}
                        onPress={() => {
                            setCurrentPage(2)}}
                        >
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={currentPage === 3 ?  styles.progressActive : styles.progressInactive}
                        onPress={() => {
                            setCurrentPage(3)}}
                        >
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                        onPress={() => {
                            if (currentPage < 3) setCurrentPage(prevCurrentPage => prevCurrentPage + 1)}}
                    >
                        <AntDesign name="right" size={30} color="blue" style={styles.arrowSVG}/>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    arrowSVG: {
        margin: 5,
        transform: [{ translateY: 2 }]
    },
    barContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // aligned horizontally
        position: 'absolute',
        bottom: 20,
        width: screenWidth,
    },
    barButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        bottom: 20,
        transform: [{ translateY: 20 }],
        
    },
    progressActive: {
        backgroundColor: 'blue',
        margin: 10,
        padding:10,
        borderRadius: 20,
        width: 50
    },
    progressInactive: {
        backgroundColor: 'black',
        margin: 10,
        padding:10,
        borderRadius: 50,
        width:50,
    },
    image: {
        alignSelf: 'auto',
        margin:10,
        resizeMode: 'contain',
        width: screenWidth 
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex:1,
        backgroundColor: 'white'
    },
    pageContainer:{
        width:screenWidth,
        flex:1,
        alignContent:'center',
        justifyContent:'center',
        backgroundColor:'white'
    },
    centerButton:{
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 20,
        backgroundColor: '#0057ac',
        padding:15,
        margin:100
    },
    textButton:{
        ...FONTS.generalText, fontSize:20
    }

});
import React, { Component } from 'react';
import {
    AppRegistry,
    Platform,
    StyleSheet,
    Text,
    View,
    Alert,
    Image,
    Button,
} from 'react-native';
import * as ImagePicker from "react-native-image-picker";
import RNSketchCanvas from 'react-native-sketch-canvas';
import FaceDetection from 'react-native-face-detection';

export class Editor extends React.Component {
    state = {
        photoURI: 'https://www.shutterstock.com/image-photo/close-portrait-young-smiling-handsome-guy-1180874596',
        photoStyle: {
            position: 'relative',
            width: 480,
            height: 480,
        },
        hasPhoto: false,
        photo: null,
        photoData: null,
        faceData: null,
        pathData: null
    };

    // chooses photos from library and sets state
    handleChoosePhoto = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, response => {
            console.log("response", response.assets[0]);
            if (response.assets[0].uri) {
                this.setState({
                    photoURI: response.assets[0].uri.replace("file://", ""),
                    photoStyle: {
                        position: 'relative',
                        width: response.assets[0].width,
                        height: response.assets[0].height
                    },
                    facesDimensions: [],
                    hasPhoto: true,
                    photo: response.assets[0],
                    photoData: response.assets[0].data
                });
            }
        })
    }

    // detects faces using react-native-face-detection
    async detectFaces(photoURI) {
        var { photoStyle } = this.state;
        // https://code.tutsplus.com/tutorials/how-to-create-a-face-detection-app-with-react-native--cms-26491
        var faceDimensions = null;
        const faces = await FaceDetection.processImage(photoURI);
        var boundingBox = faces[0]["boundingBox"];
        this.setState({
            faceData: faces,
            pathData: {
                drawer: 'faceDetector',
                size: {
                    width: photoStyle["width"],
                    height: photoStyle["height"]
                },
                path: {
                    id: 9999999,
                    color: "black",
                    width: 5,
                    data: [
                        JSON.stringify(boundingBox[0] + "," + boundingBox[1]).replace(/\//g, ''),
                        JSON.stringify(boundingBox[1] + "," + boundingBox[2]).replace(/\//g, ''),
                        JSON.stringify(boundingBox[2] + "," + boundingBox[3]).replace(/\//g, ''),
                        JSON.stringify(boundingBox[3] + "," + boundingBox[0]).replace(/\//g, '')
                    ]
                }
            }
        })
        var { pathData } = this.state;
        alert(faces.length + " faces detected." + "\n" +
            JSON.stringify("Location: " + faces[0]["boundingBox"])
        );
    };

    markFaces = () => {};

    render() {
        var { photoURI, photoStyle, pathData } = this.state;
        return (
            <View style={styles.container}>
                <View style={{ flex: 0.1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.functionButton}>
                        <Button
                            color="#CF291D"
                            title="Choose Photo"
                            onPress={this.handleChoosePhoto} />
                    </View>
                    <View style={styles.functionButton}>
                        <Button
                            color="#CF291D"
                            title="Detect Faces"
                            onPress={() => this.detectFaces(photoURI)} />
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <RNSketchCanvas
                        ref={ ref => this.canvas = ref }
                        localSourceImage={{ filename: photoURI, directory: null, mode: "AspectFit" }}
                        containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
                        canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
                        defaultStrokeIndex={0}
                        defaultStrokeWidth={30}
                        closeComponent={<View style={styles.canvasFunctionButton}><Text style={{color: 'white'}}>Close</Text></View>}
                        onClosePressed={() => {
                            this.canvas.addPath(pathData)
                        }}
                        undoComponent={<View style={styles.canvasFunctionButton}><Text style={{color: 'white'}}>Undo</Text></View>}
                        clearComponent={<View style={styles.canvasFunctionButton}><Text style={{color: 'white'}}>Clear</Text></View>}
                        eraseComponent={<View style={styles.canvasFunctionButton}><Text style={{color: 'white'}}>Eraser</Text></View>}
                        strokeColors = {[{ color: '#000000'}, { color: '#FFFFFF'}]}
                        strokeComponent={color => (
                            <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
                        )}
                        strokeSelectedComponent={(color, index, changed) => {
                            return (
                                <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
                            )
                        }}
                        strokeWidthComponent={(w) => {
                            return (
                                <View style={styles.strokeWidthButton}>
                                    <View  style={{
                                        backgroundColor: 'white', marginHorizontal: 2.5,
                                        width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2
                                    }} />
                                </View>
                            )
                        }}
                        saveComponent={<View style={styles.canvasFunctionButton}><Text style={{color: 'white'}}>Save</Text></View>}
                        savePreference={() => {
                            return {
                                folder: 'RNSketchCanvas',
                                filename: String(Math.ceil(Math.random() * 100000000)),
                                transparent: false,
                                imageType: 'png'
                            }
                        }}
                        onSketchSaved={(success, filePath) => { alert('filePath: ' + filePath); }}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#BFBFBF'
    },
    choosePhotoButton: {
        backgroundColor: '#39579A'
    },
    headerText: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
        fontWeight: "bold"
    },
    strokeColorButton: {
        marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15
    },
    strokeWidthButton: {
        marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
        justifyContent: 'center', alignItems: 'center', backgroundColor: '#1D1D1D'
    },
    canvasFunctionButton: {
        marginHorizontal: 2.5, marginVertical: 8, height: 30, width: 60,
        backgroundColor: '#1D1D1D', justifyContent: 'center', alignItems: 'center', borderRadius: 5,
    },
    functionButton: {
        marginHorizontal: 2.5, marginVertical: 3,
        justifyContent: 'center', alignItems: 'center', borderRadius: 5,
    }
});
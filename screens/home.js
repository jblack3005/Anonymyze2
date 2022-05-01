import React, { Component } from 'react';
import { View, Text, Image, Button } from 'react-native';
import * as ImagePicker from "react-native-image-picker";
import { Editor } from './editor';

export class Home extends React.Component {
    state = {
        photo: null,
    };

    handleChoosePhoto = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, response => {
            console.log("response", response.assets[0]);
            if (response.assets[0].uri) {
                this.setState({ photo: response.assets[0] });
            }
        })
    }

    render() {
        const { photo } = this.state;
        return (
            <View>
                <Button 
                    title="Choose Photo"
                    onPress={this.handleChoosePhoto} />
                {photo && (
                    <View>
                        <Editor image = {photo} />
                    </View>
                )}
            </View>
        );
    }
}
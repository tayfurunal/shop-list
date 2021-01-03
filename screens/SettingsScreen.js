import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomActionButton from "../components/CustomActionButton";
import colors from "../assets/colors";
import * as firebase from "firebase/app";
import "firebase/auth";

class SettingScreen extends Component {
  signOut = async () => {
    try {
      await firebase.auth().signOut();
      this.props.navigation.navigate("WelcomeScreen");
    } catch (err) {
      alert("Unable to sign out right now.");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <CustomActionButton
          style={{
            width: 200,
            backgroundColor: colors.listItemBg,
            borderWidth: 0.5,
            borderRadius:20,
            borderColor: colors.listItemBg,
          }}
          title="Çıkış Yap"
          onPress={this.signOut}
        >
          <Text style={{ fontWeight: "100", color: "white" }}>Çıkış Yap</Text>
        </CustomActionButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgMain,
  },
});

export default SettingScreen;

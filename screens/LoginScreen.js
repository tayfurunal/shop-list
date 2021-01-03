import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import colors from "../assets/colors";
import CustomActionButton from "../components/CustomActionButton";
import { color } from "react-native-reanimated";

class LoginScreen extends Component {
  state = {
    email: "",
    password: "",
    isLoading: false,
  };

  onSignIn = async () => {
    if (this.state.email && this.state.password) {
      this.setState({ isLoading: true });
      try {
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password);
        if (response) {
          this.setState({ isLoading: false });
          //   Navigate the user to homepage
          this.props.navigation.navigate("LoadingScreen");
        }
      } catch (err) {
        this.setState({ isLoading: false });
        switch (err.code) {
          case "auth/user-not-found":
            alert(
              "Bu bilgilere sahip kullanıcı bulunmamaktadır. Tekrar Deneyin."
            );
            break;
          case "auth/invalid-email":
            alert("Lütfen geçerli bir email adresi giriniz.");
        }
      }
    } else {
      alert("Lütfen email ve parolanızı giriniz.");
    }
  };

  onSignUp = async () => {
    if (this.state.email && this.state.password) {
      this.setState({ isLoading: true });
      try {
        const response = await firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.state.email,
            this.state.password
          );
        if (response) {
          this.setState({ isLoading: false });
          const user = await firebase
            .database()
            .ref("/users")
            .child(response.user.uid)
            .set({ email: response.user.email, uid: response.user.uid });

          this.props.navigation.navigate("LoadingScreen");
          //this.onSignIn(this.state.email, this.state.password);
        }
      } catch (err) {
        console.log(err);
        this.setState({ isLoading: false });
        if (err.code === "auth/email-already-in-use") {
          alert("Kullanıcı zaten var. Giriş yapmayı deneyiniz.");
        } else {
          console.log(err);
        }
      }
    } else {
      alert("Lütfen email ve parolanızı giriniz.");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                elevation: 1000,
              },
            ]}
          >
            <ActivityIndicator size="large" color={colors.logoColor} />
          </View>
        ) : null}
        <View style={{ flex: 1, justifyContent: "center" }}>
          <TextInput
            style={styles.textInput}
            placeholder="placeholder@mail.com"
            placeholderTextColor={colors.bgTextInputDark}
            keyboardType="email-address"
            onChangeText={(email) => this.setState({ email })}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Şifre Giriniz"
            placeholderTextColor={colors.bgTextInputDark}
            secureTextEntry
            onChangeText={(password) => this.setState({ password })}
          />
          <View style={{ alignItems: "center" }}>
            <CustomActionButton
              onPress={this.onSignIn}
              style={[styles.loginButtons, { borderColor: colors.listItemBg }]}
            >
              <Text style={{ color: "white", fontWeight: "100" }}>
                Giriş Yap
              </Text>
            </CustomActionButton>
            <CustomActionButton
              onPress={this.onSignUp}
              style={[styles.loginButtons, { borderColor: colors.listItemBg }]}
            >
              <Text style={{ color: "white", fontWeight: "100" }}>Kaydol</Text>
            </CustomActionButton>
          </View>
        </View>
         <View style={{ flex: 0.2 }}></View> 
      </View>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  textInput: {
    height: 50,
    borderWidth: 0,
    borderBottomWidth: 1,

    borderColor: colors.borderColor,
    borderRadius: 5,
    marginHorizontal: 40,
    marginBottom: 10,
    color: colors.txtWhite,
    paddingHorizontal: 10,
  },
  loginButtons: {
    borderWidth: 0.5,
    backgroundColor: colors.listItemBg,
    marginTop: 10,
    borderRadius: 20,
    width: 200,
  },
});

import React, { Component } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../assets/colors";
import CustomActionButton from "../../components/CustomActionButton";
export default class WelcomeScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgMain }}>
        <View
          style={{
            flex: 1,
            borderColor: "black",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="ios-bookmarks" size={150} color={colors.logoColor} />
          <Text style={{ fontSize: 45, fontWeight: "normal" }}>
            Alışveriş Listem
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            borderColor: "black",
            alignItems: "center",
          }}
        >
          <CustomActionButton
            style={{
              width: 200,
              backgroundColor: "transparent",
              borderWidth: 0.5,
              borderColor: colors.bgPrimary,
              marginBottom: 10,
            }}
            onPress={() => this.props.navigation.navigate("LoginScreen")}
          >
            <Text style={{ fontWeight: "100" }}>Giriş Yap</Text>
          </CustomActionButton>
        </View>
      </View>
    );
  }
}

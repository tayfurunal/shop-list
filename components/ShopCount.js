import React from "react";
import { Text, View } from "react-native";

const ShopCount = ({ title, count }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>{title}</Text>
      <Text>{count}</Text>
    </View>
  );
};

export default ShopCount;

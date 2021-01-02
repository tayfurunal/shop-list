import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { connect } from "react-redux";
import colors from "../../assets/colors";
import PropTypes from "prop-types";

const ShopsCountContainer = ({ color, type, ...props }) => (
  <View style={styles.container}>
    <Text style={{ color: "white" }}>{props.shops[type].length || 0}</Text>
  </View>
);

const mapStateToProps = (state) => {
  return {
    shops: state.shops,
  };
};

export default connect(mapStateToProps)(ShopsCountContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

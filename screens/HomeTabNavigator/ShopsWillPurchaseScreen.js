import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import ListItem from "../../components/ListItem";
import colors from "../../assets/colors";

class ShopsWillPurchaseScreen extends Component {
  renderItem = (item) => {
    return <ListItem item={item} />;
  };
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.shops.shopWillPurchase}
          renderItem={({ item }, index) => this.renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <View style={{ margin: 50, alignItems: "center" }}>
              <Text style={{ fontWeight: "bold", color:colors.txtWhite }}>Hiç Ürün Bulumuyor</Text>
            </View>
          }
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    shops: state.shops,
  };
};

export default connect(mapStateToProps)(ShopsWillPurchaseScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
});

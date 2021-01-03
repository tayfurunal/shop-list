import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from "react-native";
import ShopCount from "../components/ShopCount";
import { Ionicons } from "@expo/vector-icons";
import CustomActionButton from "../components/CustomActionButton";
import colors from "../assets/colors";
import ListItem from "../components/ListItem";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import * as firebase from "firebase/app";
import { connect } from "react-redux";
import Swipeout from "react-native-swipeout";
import { color } from "react-native-reanimated";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCount: 0,
      readingCount: 0,
      readCount: 0,
      isAddNewShopVisible: false,
      textInputData: "",
      shops: [],
      shopWillPurchase: [],
      shopPurchased: [],
      currentUser: {},
    };
    this.textInputRef = null;
  }

  componentDidMount = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam("user");
    const currentUserData = await firebase
      .database()
      .ref("users")
      .child(user.uid)
      .once("value");

    const shops = await firebase
      .database()
      .ref("shops")
      .child(user.uid)
      .once("value");

    const shopsArray = snapshotToArray(shops);

    this.setState({
      currentUser: currentUserData.val(),
    });

    this.props.loadShops(shopsArray.reverse());
  };

  showAddNewShop = () => {
    this.setState({ isAddNewShopVisible: true });
  };

  hideAddNewShop = () => {
    this.setState({ isAddNewShopVisible: false });
  };

  addShop = async (shop) => {
    this.setState({ textInputData: "" });
    this.textInputRef.setNativeProps({ text: "" });
    try {
      const snapshot = await firebase
        .database()
        .ref("shops")
        .child(this.state.currentUser.uid)
        .orderByChild("name")
        .equalTo(shop)
        .once("value");

      if (snapshot.exists()) {
        alert("zaten ekli");
      } else {
        const key = await firebase
          .database()
          .ref("shops")
          .child(this.state.currentUser.uid)
          .push().key;
        const response = await firebase
          .database()
          .ref("shops")
          .child(this.state.currentUser.uid)
          .child(key)
          .set({ name: shop, read: false });

        this.props.addShop({ name: shop, read: false, key: key });
      }
    } catch (error) {
      console.log("tayfur");
      console.log(error);
    }
  };

  markAsRead = async (selectedShop, index) => {
    try {
      await firebase
        .database()
        .ref("shops")
        .child(this.state.currentUser.uid)
        .child(selectedShop.key)
        .update({ read: true });

      let shops = this.state.shops.map((shop) => {
        if (shop.name == selectedShop.name) {
          return { ...shop, read: true };
        }
        return shop;
      });
      let shopWillPurchase = this.state.shopWillPurchase.filter(
        (shop) => shop.name != selectedShop.name
      );
      this.setState((prevState) => ({
        shops: shops,
        shopWillPurchase: shopWillPurchase,
        shopPurchased: [
          ...prevState.shopPurchased,
          { name: selectedShop.name, read: true },
        ],
        // readingCount: prevState.readingCount - 1,
        // readCount: prevState.readCount + 1,
      }));
      this.props.markShopAsRead(selectedShop);
    } catch (error) {
      console.log(error);
    }
  };

  markAsUnread = async (selectedShop, index) => {
    try {
      this.props.toggleIsLoadingShops(true);

      await firebase
        .database()
        .ref("shops")
        .child(this.state.currentUser.uid)
        .child(selectedShop.key)
        .update({ read: false });

      this.props.markShopAsUnread(selectedShop);
      this.props.toggleIsLoadingShops(false);
    } catch (error) {
      console.log(error);
      this.props.toggleIsLoadingShops(false);
    }
  };

  deleteShop = async (selectedShop, index) => {
    try {
      this.props.toggleIsLoadingShops(true);

      await firebase
        .database()
        .ref("shops")
        .child(this.state.currentUser.uid)
        .child(selectedShop.key)
        .remove();

      this.props.deleteShop(selectedShop);
      this.props.toggleIsLoadingShops(false);
    } catch (error) {
      console.log(error);
      this.props.toggleIsLoadingShops(false);
    }
  };

  renderItem = (item, index) => {
    let swipeoutButtons = [
      {
        text: "Delete",
        component: (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name="ios-trash" size={24} color={colors.txtWhite} />
          </View>
        ),
        backgroundColor: colors.bgDelete,
        onPress: () => this.deleteShop(item, index),
      },
    ];

    if (!item.read) {
      swipeoutButtons.unshift({
        text: "Alındı",
        component: (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: colors.txtWhite }}>Alındı</Text>
          </View>
        ),
        backgroundColor: colors.bgSuccessDark,
        onPress: () => this.markAsRead(item, index),
      });
    } else {
      swipeoutButtons.unshift({
        text: "Alınacaklara Ekle",
        component: (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: colors.txtWhite }}>Alınmadı</Text>
          </View>
        ),
        backgroundColor: colors.bgUnread,
        onPress: () => this.markAsUnread(item, index),
      });
    }

    return (
      <Swipeout
        autoClose={true}
        style={{ marginHorizontal: 5, marginVertical: 5 }}
        backgroundColor={colors.bgMain}
        right={swipeoutButtons}
      >
        <ListItem editable={true} marginVertical={0} item={item}>
          {item.read && (
            <Ionicons
              style={{ marginRight: 15 }}
              name="ios-checkmark"
              color={colors.logoColor}
              size={60}
            />
          )}
        </ListItem>
      </Swipeout>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView />
        <View style={{ flex: 1 }}>
          <View style={{ height: 50, flexDirection: "row", margin: 5 }}>
            <TextInput
              onChangeText={(text) => this.setState({ textInputData: text })}
              style={{
                flex: 1,
                backgroundColor: "transparent",
                paddingLeft: 5,
                borderColor: colors.txtWhite,
                borderBottomWidth: 1,
                fontSize: 22,
                fontWeight: "200",
                color: colors.txtWhite,
              }}
              placeholder="Ürün İsmi Giriniz"
              placeholderTextColor={colors.txtPlaceHolder}
              ref={(component) => {
                this.textInputRef = component;
              }}
            />
          </View>

          <FlatList
            data={this.props.shops.shops}
            renderItem={({ item }, index) => this.renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <View style={{ margin: 50, alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", color:colors.txtWhite }}>Hiç Ürün Bulumuyor</Text>
              </View>
            }
          />

          {this.state.textInputData.length > 0 ? (
            <TouchableOpacity
              onPress={() => this.addShop(this.state.textInputData)}
              style={{ position: "absolute", bottom: 130, right: 20 }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: colors.txtWhite,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>+</Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
        <SafeAreaView />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    shops: state.shops,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadShops: (shops) =>
      dispatch({ type: "LOAD_SHOPS_FROM_SERVER", payload: shops }),
    addShop: (shop) => dispatch({ type: "ADD_SHOP", payload: shop }),
    markShopAsRead: (shop) =>
      dispatch({ type: "MARK_SHOP_AS_READ", payload: shop }),
    toggleIsLoadingShops: (shop) =>
      dispatch({ type: "TOGGLE_IS_LOADING_SHOPS", payload: shop }),
    markShopAsUnread: (shop) =>
      dispatch({ type: "MARK_SHOP_AS_UNREAD", payload: shop }),
    deleteShop: (shop) => dispatch({ type: "DELETE_SHOP", payload: shop }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  imageContainer: {
    height: 70,
    width: 70,
    marginLeft: 10,
  },
  image: {
    flex: 1,
    height: null,
    width: null,
    borderRadius: 35,
  },
});

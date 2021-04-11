import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  SafeAreaView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Pressable,
  Text,
  ScrollView,
} from "react-native";
import Carousel from "react-native-snap-carousel";

const win = Dimensions.get("window");
const width = win.width * 0.8;
const margin = win.height * 0.06;

type Item = { name: string; image: any; dims: { w: number; h: number } };

const testItems = [
  {
    name: "red octobers",
    image: require("./assets/product_pics/red_octobers.jpeg"),
    dims: { w: 1188, h: 747 },
  },
  {
    name: "off---white bag",
    image: require("./assets/product_pics/offwhite_bag.jpg"),
    dims: { w: 1170, h: 1755 },
  },
  {
    name: "supreme crowbar",
    image: require("./assets/product_pics/supreme_crowbar.png"),
    dims: { w: 300, h: 135 },
  },
];

const Separator = () => <View style={{ marginTop: margin }} />;

export default function App(): JSX.Element {
  const [input, setInput] = React.useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require("./assets/bg.png")} style={styles.bg}>
        <ScrollView>
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={Keyboard.dismiss}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.container}
            >
              <View style={styles.container}>
                <Separator />
                <Image
                  source={require("./assets/logo.png")}
                  style={styles.logo}
                />
                <Separator />
                <TextInput
                  onChangeText={setInput}
                  value={input}
                  placeholder="asc"
                  style={styles.input}
                />
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            <Separator />
            <Carousel
              layout={"default"}
              data={testItems}
              contentContainerCustomStyle={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              renderItem={({ item }: { item: Item }) => (
                <Pressable style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "#ededed" : "white",
                  },
                  styles.card,
                ]}>
                  <Image
                    source={item.image}
                    style={
                      item.dims.w > item.dims.h
                        ? {
                            width: width * 0.8,
                            height: (item.dims.h / item.dims.w) * width * 0.8,
                          }
                        : {
                            width:
                              (item.dims.w / item.dims.h) * width * 0.8 * 0.6,
                            height: width * 0.6 * 0.8,
                          }
                    }
                  />
                </Pressable>
              )}
              sliderWidth={win.width}
              itemWidth={width}
            />
            <View>
              <Separator />
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "#ededed" : "white",
                  },
                  styles.pressable,
                ]}
              >
                <Text>Map</Text>
              </Pressable>
              <Separator />
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "#ededed" : "white",
                  },
                  styles.pressable,
                ]}
              >
                <Text>Store</Text>
              </Pressable>
              <Separator />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
      {__DEV__ && <StatusBar />}
    </SafeAreaView>
  );
}

const smallBordRad = width * 0.015;
const largeBordRad = width * 0.03;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bg: {
    flex: 1,
    resizeMode: "cover",
  },
  logo: {
    width,
    height: (1150 / 2000) * width,
  },
  input: {
    backgroundColor: "white",
    width,
    height: width * 0.15,
    borderRadius: smallBordRad,
    padding: width * 0.05,
  },
  card: {
    borderRadius: largeBordRad,
    height: width * 0.6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  pressable: {
    width,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: width * 0.15,
    borderRadius: smallBordRad,
  },
});

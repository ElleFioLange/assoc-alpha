import React, { useState, useRef } from "react";
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
  Modal,
  Button,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import Logo from "./assets/logo.svg";
import { OPENAI_API_KEY } from "./api-key";
import Animated, { Easing } from "react-native-reanimated";

const win = Dimensions.get("window");
const width = win.width * 0.8;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Item = { name: string; image: any };

const fpItems = [
  {
    name: "red octobers",
    image: require("./assets/product_pics/red_octobers.jpeg"),
  },
  {
    name: "off---white bag",
    image: require("./assets/product_pics/offwhite_bag.jpeg"),
  },
  {
    name: "supreme crowbar",
    image: require("./assets/product_pics/supreme_crowbar.png"),
  },
  {
    name: "dior j1s",
    image: require("./assets/product_pics/dior_j1s.jpeg"),
  },
  {
    name: "vv sandals",
    image: require("./assets/product_pics/vv_sandals.jpeg"),
  },
];

const drItems = [
  {
    name: "ipod",
    image: require("./assets/product_pics/dr/ipod.jpeg"),
  },
  {
    name: "light",
    image: require("./assets/product_pics/dr/light.jpg"),
  },
  {
    name: "radio",
    image: require("./assets/product_pics/dr/radio.jpg"),
  },
  {
    name: "record_player",
    image: require("./assets/product_pics/dr/record_player.jpg"),
  },
  {
    name: "t3",
    image: require("./assets/product_pics/dr/t3.jpg"),
  },
];

const Separator = (n: number) => (
  <View style={{ marginTop: width * 0.02 * n }} />
);

export default function App() {
  const [dr, setDr] = useState(false);
  const [asc, setAsc] = useState("");
  const [ans, setAns] = useState("");

  const [ascModalVis, setAscModalVis] = useState(false);
  const [openAiAnswer, setOpenAiAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const toggleLoading = (l: boolean) => {
    l
      ? Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 550,
          easing: Easing.ease,
        }).start()
      : Animated.timing(fadeAnim, {
          toValue: 0.1,
          duration: 550,
          easing: Easing.ease,
        }).start();
    setLoading(!l);
  };

  const ascFn = async (question: string) => {
    toggleLoading(false);
    fetch("https://api.openai.com/v1/engines/davinci/completions", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: `I am an AI that can answer questions about Dieter Rams.
            Q: Who?
            A: Dieter Rams
            Q: What?
            A: Industrial Design
            Q: Where?
            A: Germany
            Q: When?
            A: 1961
            Q: Why?
            A: Design inhabits every built object, environment, and service. To see design is to see thought manifested in the physical.
            Q: ${question}
            A:`,
        max_tokens: 150,
        temperature: 0.56,
        stop: ["\n"],
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setOpenAiAnswer(response.choices[0].text);
        toggleLoading(true);
        setAscModalVis(true);
        setAsc("");
      });
  };

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const answerFn = (answer: string) => {
    toggleLoading(false);
    sleep(1500).then(() => {
      answer === "Dieter Rams" ? setDr(true) : setDr(false);
      setAns("");
      toggleLoading(true);
    });
  };

  return (
    <ImageBackground source={require("./assets/bg_anim.gif")} style={styles.bg}>
      <Animated.View
        style={[styles.bg, { opacity: fadeAnim }]}
        pointerEvents={loading ? "none" : "auto"}
      >
        <ImageBackground source={require("./assets/bg.png")} style={styles.bg}>
          {/* <SafeAreaView style={styles.container}> */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={ascModalVis}
            onRequestClose={() => {
              setAscModalVis(!ascModalVis);
            }}
          >
            <SafeAreaView
              style={{
                backgroundColor: "white",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ScrollView
                style={{
                  flex: 1,
                  padding: width * 0.1,
                  // alignItems: "center",
                  // justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    // fontFamily: "San Francisco",
                    fontSize: 50,
                    // fontWeight: "bold",
                  }}
                >
                  {openAiAnswer}
                </Text>
                {Separator(3)}
                <Button
                  title="Close"
                  onPress={() => {
                    setAscModalVis(!ascModalVis);
                  }}
                />
                {Separator(9)}
              </ScrollView>
            </SafeAreaView>
          </Modal>
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
                  {Separator(9)}
                  <Logo
                    width={width}
                    height={width * 0.6}
                    style={styles.shadow}
                  />
                  {/* <Image
                          source={require("./assets/logo.svg")}
                          style={styles.logo}
                          /> */}
                  {Separator(3)}
                  <TextInput
                    onChangeText={setAsc}
                    value={asc}
                    placeholder="asc"
                    style={[styles.input, styles.shadow]}
                    onSubmitEditing={({ nativeEvent }) => {
                      ascFn(nativeEvent.text);
                    }}
                  />
                  {Separator(3)}
                  <TextInput
                    onChangeText={setAns}
                    value={ans}
                    placeholder="answer"
                    style={[styles.input, styles.shadow]}
                    onSubmitEditing={({ nativeEvent }) =>
                      answerFn(nativeEvent.text)
                    }
                  />
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
            <View style={styles.container}>
              {Separator(6)}
              <Carousel
                layout={"default"}
                data={dr ? drItems : fpItems}
                contentContainerCustomStyle={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                style={styles.shadow}
                renderItem={({ item }: { item: Item }) => (
                  <View style={[styles.card, styles.shadow]}>
                    <Image source={item.image} style={styles.productPic} />
                  </View>
                )}
                sliderWidth={win.width}
                itemWidth={width}
              />
              <View>
                <Pressable
                  onPress={() => null}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "#ededed" : "white",
                    },
                    styles.pressable,
                    styles.shadow,
                  ]}
                >
                  <Text>Map</Text>
                </Pressable>
                {Separator(3)}
                <Pressable
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "#ededed" : "white",
                    },
                    styles.pressable,
                    styles.shadow,
                  ]}
                >
                  <Text>Mine</Text>
                </Pressable>
                {Separator(3)}
              </View>
            </View>
          </ScrollView>
          {/* </SafeAreaView> */}
        </ImageBackground>
      </Animated.View>
    </ImageBackground>
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
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: width * 0.03 },
    shadowRadius: 10,
    shadowOpacity: 0.25,
  },
  input: {
    backgroundColor: "white",
    width,
    height: width * 0.15,
    borderRadius: smallBordRad,
    padding: width * 0.05,
  },
  card: {
    backgroundColor: "white",
    borderRadius: largeBordRad,
    height: width * 0.6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: width * 0.02,
    marginBottom: width * 0.12,
  },
  productPic: {
    flex: 1,
    resizeMode: "contain",
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

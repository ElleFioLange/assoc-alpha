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
import Svg, { Circle, Line } from "react-native-svg";
import Carousel from "react-native-snap-carousel";
import Logo from "./assets/logo.svg";
import { OPENAI_API_KEY } from "./api-key";
import Animated, { Easing } from "react-native-reanimated";
import { FlatList } from "react-native-gesture-handler";

const win = Dimensions.get("window");
const width = win.width * 0.8;
const height = win.height * 0.8;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Item = { name: string; content: JSX.Element };

const smallBordRad = width * 0.015;
const largeBordRad = width * 0.03;

const styles = StyleSheet.create({
  title: {
    fontSize: 50,
    textAlignVertical: "center",
    textAlign: "center",
  },
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
    textAlign: "center",
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
  shelf: {
    width: width,
    height: height / 4,
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
  },
  shelfItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: width,
  },
});

const fpItems = [
  {
    name: "red octobers",
    content: (
      <Image
        source={require("./assets/product_pics/red_octobers.jpeg")}
        style={styles.productPic}
      />
    ),
  },
  {
    name: "off---white bag",
    content: (
      <Image
        source={require("./assets/product_pics/offwhite_bag.jpeg")}
        style={styles.productPic}
      />
    ),
  },
  {
    name: "supreme crowbar",
    content: (
      <Image
        source={require("./assets/product_pics/supreme_crowbar.png")}
        style={styles.productPic}
      />
    ),
  },
  {
    name: "dior j1s",
    content: (
      <Image
        source={require("./assets/product_pics/dior_j1s.jpeg")}
        style={styles.productPic}
      />
    ),
  },
  {
    name: "vv sandals",
    content: (
      <Image
        source={require("./assets/product_pics/vv_sandals.jpeg")}
        style={styles.productPic}
      />
    ),
  },
];

const drItems = [
  {
    name: "ipod",
    content: (
      <Image
        source={require("./assets/product_pics/dr/ipod.jpeg")}
        style={styles.productPic}
      />
    ),
  },
  {
    name: "light",
    content: (
      <Image
        source={require("./assets/product_pics/dr/light.jpg")}
        style={styles.productPic}
      />
    ),
  },
  {
    name: "radio",
    content: (
      <Image
        source={require("./assets/product_pics/dr/radio.jpg")}
        style={styles.productPic}
      />
    ),
  },
  {
    name: "record_player",
    content: (
      <Image
        source={require("./assets/product_pics/dr/record_player.jpg")}
        style={styles.productPic}
      />
    ),
  },
  // {
  //   name: "t3",
  //   image: require("./assets/product_pics/dr/t3.jpg"),
  // },
];

const Separator = (n: number) => (
  <View style={{ marginTop: width * 0.02 * n }} />
);

export default function App(): JSX.Element {
  const [dr, setDr] = useState(false);
  const [asc, setAsc] = useState("");
  const [ans, setAns] = useState("");

  const [modalVis, setModalVis] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
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
        setModalContent(
          <Text
            style={{
              // fontFamily: "San Francisco",
              fontSize: 50,
              // fontWeight: "bold",
            }}
          >
            {response.choices[0].text}
          </Text>
        );
        toggleLoading(true);
        setModalVis(true);
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

  const openMap = () => {
    setModalContent(
      <View style={[styles.container, { width: width, height: height }]}>
        <Svg height="100%" width="100%" viewBox="0 0 100 100">
          <Line
            x1="50"
            y1="75"
            x2="50"
            y2="25"
            stroke="#e0e0e0"
            strokeWidth="1"
          />
          <Line
            x1="50"
            y1="75"
            x2="65"
            y2="95"
            stroke="#e0e0e0"
            strokeWidth="1"
          />
          <Line
            x1="50"
            y1="75"
            x2="80"
            y2="75"
            stroke="#e0e0e0"
            strokeWidth="1"
          />
          <Line
            x1="15"
            y1="72"
            x2="65"
            y2="95"
            stroke="#e0e0e0"
            strokeWidth="1"
          />
          <Line
            x1="15"
            y1="72"
            x2="10"
            y2="50"
            stroke="#e0e0e0"
            strokeWidth="1"
          />
          <Line
            x1="50"
            y1="25"
            x2="10"
            y2="50"
            stroke="#e0e0e0"
            strokeWidth="1"
          />
          <Line
            x1="50"
            y1="25"
            x2="75"
            y2="20"
            stroke="#e0e0e0"
            strokeWidth="1"
          />
          <Line
            x1="80"
            y1="75"
            x2="75"
            y2="20"
            stroke="#e0e0e0"
            strokeWidth="1"
          />
          <Line
            x1="55"
            y1="-10"
            x2="75"
            y2="20"
            stroke="#e0e0e0"
            strokeWidth="1"
          />
          <Circle
            cx="50"
            cy="75"
            r="5"
            stroke="#2462ff"
            strokeWidth="0.5"
            fill="white"
          />
          <Circle
            cx="50"
            cy="25"
            r="5"
            stroke="#2462ff"
            strokeWidth="0.5"
            fill="white"
          />
          <Circle
            cx="80"
            cy="75"
            r="5"
            stroke="#2462ff"
            strokeWidth="0.5"
            fill="white"
          />
          <Circle
            cx="65"
            cy="95"
            r="5"
            stroke="#2462ff"
            strokeWidth="0.5"
            fill="white"
          />
          <Circle
            cx="15"
            cy="72"
            r="5"
            stroke="#2462ff"
            strokeWidth="0.5"
            fill="white"
          />
          <Circle
            cx="10"
            cy="50"
            r="5"
            stroke="#2462ff"
            strokeWidth="0.5"
            fill="white"
          />
          <Circle
            cx="75"
            cy="20"
            r="5"
            stroke="#2462ff"
            strokeWidth="0.5"
            fill="white"
          />
          <Circle
            cx="55"
            cy="-10"
            r="5"
            stroke="#2462ff"
            strokeWidth="0.5"
            fill="white"
          />
        </Svg>
      </View>
    );
    setModalVis(true);
  };

  const openMine = () => {
    setModalContent(
      <>
        <FlatList
          data={fpItems}
          renderItem={({ item }) => (
            <View style={styles.shelfItem}>{item.content}</View>
          )}
          horizontal={true}
          style={styles.shelf}
          keyExtractor={(item) => item.name}
        />
        <Text>Home</Text>
        <FlatList
          data={drItems}
          renderItem={({ item }) => (
            <View style={styles.shelfItem}>{item.content}</View>
          )}
          horizontal={true}
          style={styles.shelf}
          keyExtractor={(item) => item.name}
        />
        <Text>Dieter Rams</Text>
      </>
    );
    setModalVis(true);
  };

  const openItem = (item) => {
    setModalContent(
      <View style={styles.container}>
        <View
          style={{
            width: width,
            height: width * 0.6,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {item.content}
        </View>
        <Text style={{ fontSize: 15 }}>{item.name}</Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed imperdiet
          sodales enim eu interdum. Cras elit sapien, tristique et mattis eget,
          interdum in ligula. Nullam condimentum nisl vitae tellus auctor, a
          lobortis est interdum. Ut luctus nunc dui, a consectetur magna rutrum
          sed. Pellentesque aliquam vitae dui et lobortis. Aliquam eu bibendum
          magna. Quisque pellentesque felis nec laoreet mattis. Nam sed nibh
          luctus, congue enim ut, ultricies erat. Nullam placerat, justo vitae
          interdum vehicula, dui sem pulvinar ligula, a rutrum sapien sapien
          eget felis. Sed viverra nibh in turpis blandit tempor. Curabitur enim
          tellus, vestibulum quis nisl finibus, efficitur tincidunt nunc. Donec
          bibendum urna ut felis fringilla convallis. Duis vitae augue non
          tellus pharetra varius. Donec tortor nulla, euismod sit amet consequat
          vel, luctus id elit. Nam at eleifend ante. In fringilla finibus neque
          at blandit. Nullam nec arcu sapien.
        </Text>
      </View>
    );
    setModalVis(true);
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
            transparent={false}
            visible={modalVis}
            onRequestClose={() => {
              setModalVis(!modalVis);
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
                {modalContent}
                {Separator(3)}
                <Button
                  title="Close"
                  onPress={() => {
                    setModalVis(!modalVis);
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
                    placeholder="ASC"
                    style={[styles.input, styles.shadow]}
                    onSubmitEditing={({ nativeEvent }) => {
                      ascFn(nativeEvent.text);
                    }}
                  />
                  {Separator(3)}
                  <TextInput
                    onChangeText={setAns}
                    value={ans}
                    placeholder="ANSWER"
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
                  <TouchableWithoutFeedback onPress={() => openItem(item)}>
                    <View style={[styles.card, styles.shadow]}>
                      {item.content}
                    </View>
                  </TouchableWithoutFeedback>
                )}
                sliderWidth={win.width}
                itemWidth={width}
              />
              <View>
                <Pressable
                  onPress={openMap}
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
                  onPress={openMine}
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

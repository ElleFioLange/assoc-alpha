import React, { useState } from "react";
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

const win = Dimensions.get("window");
const width = win.width * 0.8;

type Item = { name: string; image: any };

const testItems = [
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

const ascFn = async (
  question: string,
  setAscModalVis: (b: boolean) => void,
  setOpenAiAnswer: (text: string) => void
) => {
  setAscModalVis(true);
  fetch("https://api.openai.com/v1/engines/davinci/completions", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.
          Human: Hello, who are you?
          AI: I am an AI created by OpenAI. How can I help you today?
          Human: ${question}
          AI:`,
      max_tokens: 20,
      temperature: 0.9,
      stop: ["\n"],
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      setOpenAiAnswer(response.choices[0].text);
    });
};

const Separator = (n: number) => (
  <View style={{ marginTop: width * 0.02 * n }} />
);

export default function Home(): JSX.Element {
  const [asc, setAsc] = useState("");
  const [ans, setAns] = useState("");
  const [loading, setLoading] = useState(false);

  const [ascModalVis, setAscModalVis] = useState(false);
  const [openAiAnswer, setOpenAiAnswer] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={
          loading
            ? require("./assets/spiderman.gif")
            : require("./assets/bg.png")
        }
        style={styles.bg}
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={ascModalVis}
          onRequestClose={() => {
            setAscModalVis(!ascModalVis);
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>{openAiAnswer}</Text>
            <Button
              title="Close"
              onPress={() => {
                setAscModalVis(!ascModalVis);
              }}
            />
          </View>
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
                    ascFn(nativeEvent.text, setAscModalVis, setOpenAiAnswer);
                  }}
                />
                {Separator(3)}
                <TextInput
                  onChangeText={setAns}
                  value={ans}
                  placeholder="answer"
                  style={[styles.input, styles.shadow]}
                />
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            {Separator(6)}
            <Carousel
              layout={"default"}
              data={testItems}
              contentContainerCustomStyle={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              renderItem={({ item }: { item: Item }) => (
                <View style={[styles.card]}>
                  <Image source={item.image} style={styles.productPic} />
                </View>
              )}
              sliderWidth={win.width}
              itemWidth={width}
            />
            <View>
              {Separator(6)}
              <Pressable
                onPress={() => setLoading(!loading)}
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
      </ImageBackground>
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
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
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
    overflow: "hidden",
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

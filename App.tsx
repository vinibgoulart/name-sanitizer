import {Alert, Clipboard, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import {useEffect, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [names, setNames] = useState('');

  const copyToClipboard = (text: string) => {
    if (text) {
      Clipboard.setString(text)
    }
  }

  const saveData = async (key: string, data: string) => {
    try {
      await AsyncStorage.setItem(key, data)
    } catch (e) {
      Alert.alert('Algo deu errado em salvar os dados')
    }
  }

  const getData = async (key: string) => {
    try {
      return await AsyncStorage.getItem(key)
    } catch (e) {
      console.log('Erro ao buscar dados: ', e)
    }
  }

  const sanitizeNames = () => {
    const splittedNames = names.split('\n')

    // remove duplicated values
    const fomarttedNames = [...new Set(splittedNames.map((name) => {
      const sanitized = name.replace(/[^a-zA-Z\s']/g, '');

      const trimmed = sanitized.trim();

      const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

      return capitalized;
    }).sort())];

    setNames(fomarttedNames.join('\n'))
    saveData('names', names)
  }

  useEffect(() => {
    const getNames = async () => {
      const data = await getData('names');
      if (data) {
        setNames(data)
      }
    }

    getNames();
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{
          fontSize: 30,
          marginVertical: 10,
          fontWeight: 'bold'
        }}>Name Formatter</Text>
        <View>
          <Text style={styles.title}>Como usar?</Text>
          <Text style={styles.text}>Utilize o campo 'Nomes' para inserir todos os nomes, eles devem ser separados por
            linha, ou seja, cada nome em uma linha.</Text>
          <Text style={styles.text}>Após colocar os nomes você pode formatar ou salvar eles no seu dispositivo para
            acessar futuramente.</Text>
          <Text style={styles.text}>
            Não desinstale ou limpe os arquivos ou todos os nomes serão perdidos!
          </Text>
        </View>
        <View>
          <Text style={styles.title}>Nomes</Text>
          <TextInput
            placeholder={'Insira os nomes aqui separados por linha'}
            editable
            multiline
            onChangeText={text => setNames(text)}
            value={names}
            style={styles.input}
          />
        </View>
      </View>
      <View>
        <View style={styles.buttonView}>
          <Pressable
            style={({pressed}) => pressed ? {...styles.buttonLeft, backgroundColor: '#f26868'} : styles.buttonLeft}
            onPress={() => copyToClipboard(names)}>
            <Text style={styles.textButton}>Copiar</Text>
          </Pressable>
          <Pressable
            style={({pressed}) => pressed ? {...styles.buttonRight, backgroundColor: '#f26868'} : styles.buttonRight}
            onPress={() => setNames('')}>
            <Text style={styles.textButton}>Limpar</Text>
          </Pressable>
        </View>
        <Pressable
          style={({pressed}) => pressed ? {...styles.button, backgroundColor: '#f26868'} : styles.button}
          onPress={() => sanitizeNames()}>
          <Text style={styles.textButton}>Formatar</Text>
        </Pressable>
        <Pressable
          style={({pressed}) => pressed ? {...styles.button, backgroundColor: '#f26868'} : styles.button}
          onPress={() => saveData('names', names)}>
          <Text style={styles.textButton}>Salvar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const button = StyleSheet.create({
  default: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#E53E3E',
  }
})

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    marginTop: 50,
    margin: 30
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: 'bold'
  },
  text: {
    marginVertical: 5
  },
  input: {
    height: 250,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: button.default,
  buttonLeft: {
    ...button.default,
    flex: 1,
    marginRight: 4
  },
  buttonRight: {
    ...button.default,
    flex: 1,
    marginLeft: 4
  },
  textButton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

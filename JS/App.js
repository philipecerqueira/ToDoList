import React, { useState, useEffect  } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Keyboard, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function App()
{
  const [task, setTask] = useState([]);
  const [newTask, setNewTask] = useState('');

  async function addTask()
  {
    const search = task.filter(task => task === newTask)
    
    if (newTask == '') {
      return Alert.alert('Atenção', 'Nada foi inserido');
    }
    
    if (search.length ==! 0) {
      return Alert.alert('Atenção', 'Essa task já foi inserida');
    } 
    setTask([ ... task, newTask]);
    setNewTask('');

    Keyboard.dismiss();
  }

  async function dellTask(item)
  {
    Alert.alert(
      'Deletar task', 
      'Tem certeza que deseja excluir essa task?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return;
          },
          style: 'cancel'
        },
        {
          text: 'Ok',
          onPress: () => setTask(task.filter(tasks => tasks !== item))
        }
      ],
      {cancelable: false}
    )
  }

  useEffect(() => {
    async function salvarDados() {
      AsyncStorage.setItem('task', JSON.stringify(task));
    }
    salvarDados();
  }, [task]);

  useEffect(() => {
    async function carregaDados() {
      const task = await AsyncStorage.getItem('task');
      
      if (task) {
        setTask(JSON.parse(task));
      }
    }
    carregaDados();
  }, []);

  return (
    <>
    <View style={styles.container}>
      <View style={styles.body}>
        <FlatList 
          style= {styles.flatList}
          data= {task}
          keyExtractor= {item => item.toString()}
          showsVerticalScrollIndicator= {false}
          renderItem= {({item}) => (
            <View style={styles.containerView}>
              <Text style={styles.texto}>{item}</Text>
              <TouchableOpacity onPress={() => dellTask(item)}>
                <MaterialIcons name="delete-forever" size={24} color="#f64c75"/>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <View style={styles.form}>
        <TextInput
          style = {styles.input}
          placeholderTextColor = '#999'
          placeholder = 'Adicione uma tarefa'
          autoCorrect = {true}
          maxLength = {100}
          onChangeText= {text => setNewTask(text)}
          value= {newTask}
        />
        <TouchableOpacity style = {styles.button} onPress={() => addTask()}>
          <MaterialIcons name="add-task" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 28,
    paddingVertical: 20,
    marginTop: 20,
  },
  body: {
    flex:1,
  },
  form: {
    padding: 0,
    height: 60,
    justifyContent: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  input: {
    flex:1,
    height: 40,
    backgroundColor: '#eee',
    borderRadius:4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth:1,
    borderColor: '#eee',
  },
  button: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c6cce',
    borderRadius: 4,
    marginLeft: 10,
  },
  flatList: {
    flex: 1,
    marginTop: 5,
  },
  containerView: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#eee',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eee',
  },
  texto: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
});

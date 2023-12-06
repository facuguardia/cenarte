import React, { useReducer, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface State {
  meals: string[];
  selectedMeal: string;
}

interface Action {
  type: string;
  payload: any;
}

const mealsReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_MEALS':
      return { ...state, meals: action.payload };
    case 'SET_SELECTED_MEAL':
      return { ...state, selectedMeal: action.payload };
    default:
      return state;
  }
};

export default function App() {
  const initialState: State = {
    meals: [],
    selectedMeal: '',
  };

  const App = () => {
    const [state, dispatch] = useReducer(mealsReducer, initialState);

    useEffect(() => {
      // Recuperar comidas guardadas al cargar la aplicación
      retrieveSavedMeals();
    }, []);

    const retrieveSavedMeals = async () => {
      try {
        const storedMeals = await AsyncStorage.getItem('savedMeals');
        if (storedMeals !== null) {
          dispatch({ type: 'SET_MEALS', payload: JSON.parse(storedMeals) });
        }
      } catch (error) {
        console.error('Error al recuperar las comidas guardadas:', error);
      }
    };

    const handleSaveMeals = async () => {
      const mealArray = state.meals.split(',').map((item: string) => item.trim());

      if (mealArray.length < 5) {
        Alert.alert('Error', 'Por favor, ingresa al menos 5 comidas.');
      } else {
        dispatch({ type: 'SET_MEALS', payload: mealArray });
        try {
          // Almacenar comidas en AsyncStorage
          await AsyncStorage.setItem('savedMeals', JSON.stringify(mealArray));
          Alert.alert('Éxito', 'Comidas guardadas correctamente.');
        } catch (error) {
          console.error('Error al guardar las comidas:', error);
        }
      }
    };

    const handleGenerateMeal = () => {
      if (state.meals.length < 5) {
        Alert.alert('Error', 'Por favor, guarda al menos 5 comidas antes de generar una cena.');
      } else {
        const randomIndex = Math.floor(Math.random() * state.meals.length);
        dispatch({ type: 'SET_SELECTED_MEAL', payload: state.meals[randomIndex] });
      }
    };

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Ingresa tus comidas:</Text>
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            paddingHorizontal: 10,
          }}
          onChangeText={(text: string) => dispatch({ type: 'SET_MEALS', payload: text })}
          value={state.meals}
          placeholder="Comida1, Comida2, Comida3, ..."
        />
        <Button title="Guardar Comidas" onPress={handleSaveMeals} />
        <Button title="Generar Cena" onPress={handleGenerateMeal} />
        {state.selectedMeal !== '' && (
          <Text style={{ marginTop: 20 }}>Cena sugerida: {state.selectedMeal}</Text>
        )}
      </View>
    );
  };
}

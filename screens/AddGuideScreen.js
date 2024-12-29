import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

const AddGuideScreen = () => {
  const db = getFirestore();
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [dob, setDob] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [inputs, setInputs] = useState({});
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Kılavuz ekleme için state'ler
  const [guideName, setGuideName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [testType, setTestType] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  // Dinamik kılavuzları çek
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const guidesSnapshot = await getDocs(collection(db, "Guides"));
        const guidesList = [];
        guidesSnapshot.forEach((doc) =>
          guidesList.push({ id: doc.id, data: doc.data() })
        );
        setGuides(guidesList);
        if (guidesList.length > 0) setSelectedGuide(guidesList[0].id);
      } catch (error) {
        console.error("Error fetching guides:", error.message);
      }
    };
    fetchGuides();
  }, []);

  const calculateAgeInMonths = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const yearDiff = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const totalMonths = yearDiff * 12 + monthDiff;
    console.log(`Hesaplanan yaş (ay): ${totalMonths}`);
    return totalMonths >= 0 ? totalMonths : 0;
  };

  const determineAgeRange = (months, guideData) => {
    const ageInYears = months / 12;
    console.log(`Hesaplanan yaş (yıl): ${ageInYears.toFixed(2)}`);
    const ageRange = Object.keys(guideData || {}).find((range) => {
      const [minAge, maxAge] = range.split("-").map(Number);
      return ageInYears >= minAge && ageInYears < maxAge;
    });
    return ageRange || null;
  };

  const evaluate = () => {
    if (!selectedGuide || !dob) {
      alert("Kılavuz ve doğum tarihi seçilmelidir!");
      return;
    }

    const months = calculateAgeInMonths(dob);
    const selectedGuideData = guides.find(
      (guide) => guide.id === selectedGuide
    )?.data;

    if (!selectedGuideData) {
      alert("Seçilen kılavuz bulunamadı!");
      return;
    }

    const ageRange = determineAgeRange(months, selectedGuideData);

    if (!ageRange || !selectedGuideData[ageRange]) {
      console.log(`Yaş aralığı bulunamadı. Hesaplanan yaş aralığı: ${ageRange}`);
      alert("Yaş aralığına uygun kılavuz bulunamadı!");
      return;
    }

    const results = Object.entries(inputs).map(([key, value]) => {
      const [min, max] = selectedGuideData[ageRange]?.[key] || [];
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) || min === undefined || max === undefined) {
        return { key, value, status: "Bilinmiyor" };
      }
      if (numericValue < min)
        return { key, value, status: "Düşük", color: "red" };
      if (numericValue > max)
        return { key, value, status: "Yüksek", color: "red" };
      return { key, value, status: "Normal", color: "green" };
    });

    setEvaluationResult(results);
  };

  const handleInputChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDob(selectedDate.toISOString().split("T")[0]);
    }
  };

  const handleAddGuide = async () => {
    try {
      const guideDocRef = doc(db, "Guides", guideName);
      const ageGroupData = {
        [ageRange]: {
          [testType]: [parseFloat(minValue), parseFloat(maxValue)],
        },
      };
      await setDoc(guideDocRef, ageGroupData, { merge: true });

      alert("Kılavuz başarıyla eklendi!");
      setAgeRange("");
      setTestType("");
      setMinValue("");
      setMaxValue("");
    } catch (error) {
      console.error("Error adding guide:", error.message);
      alert("Kılavuz eklenemedi!");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      
      <Text style={styles.title}>Kılavuz Ekleme ve Değerlendirme</Text>

      <View style={styles.divider} />

      {/* Kılavuz Ekleme Bölümü */}
      <Text style={styles.subtitle}>Kılavuz Ekle</Text>
      <TextInput
        placeholder="Kılavuz Adı (Örn: Default Guide)"
        value={guideName}
        onChangeText={setGuideName}
        style={styles.input}
      />
      <TextInput
        placeholder="Yaş Aralığı (Örn: 2-3)"
        value={ageRange}
        onChangeText={setAgeRange}
        style={styles.input}
      />
      <TextInput
        placeholder="Test Türü (Örn: IgM, IgG)"
        value={testType}
        onChangeText={setTestType}
        style={styles.input}
      />
      <TextInput
        placeholder="Minimum Değer"
        value={minValue}
        onChangeText={setMinValue}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Maksimum Değer"
        value={maxValue}
        onChangeText={setMaxValue}
        style={styles.input}
        keyboardType="numeric"
      />
      <Button title="Kılavuz Ekle" onPress={handleAddGuide} />

      <View style={styles.divider} />

      {/* Kılavuz Seçimi ve Değerlendirme */}
      <Text style={styles.subtitle}>Kılavuz Seçimi ve Değerlendirme</Text>
      <Picker
        selectedValue={selectedGuide}
        onValueChange={(itemValue) => setSelectedGuide(itemValue)}
        style={styles.picker}
      >
        {guides.map((guide) => (
          <Picker.Item key={guide.id} label={guide.id} value={guide.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Doğum Tarihi (Gün/Ay/Yıl):</Text>
      <Button title="Tarih Seç" onPress={() => setShowDatePicker(true)} />
      {dob && <Text>Seçilen Tarih: {dob}</Text>}
      {showDatePicker && (
        <DateTimePicker
          value={dob ? new Date(dob) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Değerleri Girin:</Text>
      {["IgA", "IgM", "IgG", "IgG1", "IgG2", "IgG3", "IgG4"].map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key}
          value={inputs[key]}
          onChangeText={(value) => handleInputChange(key, value)}
          keyboardType="numeric"
        />
      ))}

      <Button title="Değerlendir" onPress={evaluate} />

      {evaluationResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Değerlendirme Sonuçları:</Text>
          {evaluationResult.map(({ key, value, status, color }) => (
            <Text
              key={key}
              style={{ color: color || "black", fontWeight: "bold" }}
            >
              {key}: {value} - {status}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    marginBottom: 20,
    backgroundColor: "#f3f4f6",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default AddGuideScreen;

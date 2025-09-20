import React from 'react';
import { ActivityIndicator, Dimensions, FlatList, KeyboardAvoidingView, Modal, ScrollView, Touchable, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedInputText } from '@/components/ThemedInputText';
import { useEffect, useState } from 'react';
import { Redirect, router } from 'expo-router';
import styles from './createAssetPage.style';
import { Routes } from '@/constants/Routes';
import { Dropdown } from 'react-native-element-dropdown';

import { getCategories, getCategoryProperties, createAsset, getPropertyValues } from "@/app/audit/services/categoryService";
import { useToast } from "@/context/ToastContext";
import { useThemeColor } from '@/hooks/useThemeColor';
import ScreenWrapper from '@/components/ScreenWrapper/ScreenWrapper';
import { useSession } from '@/context/UserSessionContext';
import { checkAuthError } from '@/utils/roundOff';
import { FLOORS } from '@/constants/assets';
import { Colors } from '@/constants/Colors';

type category = {
  id : string,
  type : string
}

type catgoryProperty = {
  id : string,
  type : string,
  key : string // property name
}

type propertyValue = {
  value : string
}

export default function createAudit() {

  const [value, setValue] = useState(null);
  const [categories, setCategories] = useState<category[]>([]);
  const [categoryProperties, setCategoryProperties] = useState<catgoryProperty[]>([]);
  const [loading, setloading] = useState<boolean>(true);
  const [currentField,setCurrentField] = useState<catgoryProperty | null>(null);
  const [fieldValues,setFieldValues] = useState<propertyValue[]>([]);
  const [properties, setProperties] = useState<any>({})
  const { showToast } = useToast();
  const { token, signOut, isAdmin } = useSession();


  if(!isAdmin()) {
     return <Redirect href="/Home" />;
  } 

  const data = [
    { label: 'In use', value: 'IN_USE' },
    { label: 'In maintanance', value: 'IN_MAINTENANCE' },
    // { label: 'Scrap', value: 'SCRAP' },
    { label: 'In stock', value: 'IN_STOCK' },
  ];

  const fetchCategories = async () => {
    try {
      setloading(true);
      const data = await getCategories(token);
      setCategories(data.data);
    } catch (e: any) {
      showToast({
        type: "error",
        text1: e.message,
      });
      if(checkAuthError(e)){
        signOut();
        
        router.dismissAll();
                      router.replace("/");
                  }
    }finally{
      setloading(false);
    }
  };

  const reset = () =>{
    setValue(null);
    setCategoryProperties([]);
    setProperties({});
  }

  const fetchCategoryProperties = async (value:number) => {
    try {
      const data = await getCategoryProperties(value,token);
      setCategoryProperties(data.data);
    } catch (e: any) {
      showToast({
        type: "error",
        text1: e.message,
      });
      if(checkAuthError(e)){
        signOut();

                      router.dismissAll();
                      router.replace("/");
                  }
    }finally{
      setloading(false);
    }
  }

  const fetchPropertyValues = async (id:string)=>{
    try {
      let data = await getPropertyValues(token,id);
      setFieldValues(data.data);
    } catch (e:any) {
      showToast({
        type: "error",
        text1: e.message,
      });
      if(checkAuthError(e)){
        signOut();
        
        router.dismissAll();
        router.replace("/");
    }
    }
  }

  useEffect(()=>{
    if(currentField) fetchPropertyValues(currentField.id);
  },[currentField])

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (value) {
      setProperties({ "type": value });
      fetchCategoryProperties(value);
    }
  }, [value])

  const setPropertyValue = (key: string, value: string) => {
    setProperties({ ...properties, [key]: value })
  }

  const getPropertyValue = (key: string) => {
    return key in properties ? properties[key] : "";
  }

  const backgroundColor = useThemeColor({ light: 'white', dark: 'black' }, 'background');

  const handleSave = async () => {
    try {
      setloading(true);
      console.log(properties)
      const createdAsset = await createAsset(properties,token);
      if (createdAsset?.uniqueId) {
        reset();
        //@ts-ignore
        router.push(`${Routes.generateQR}/${createdAsset.uniqueId}`);
      } else {
        showToast({
          type: "error",
          text1: "Something went wrong!",
        });
      }
    } catch (e: any) {
      showToast({
        type: "error",
        text1: e.message,
      });
      if(checkAuthError(e)){
        signOut();
        
        router.dismissAll();
                      router.replace("/");
                  }
    }finally{
      setloading(false);
    }
  } 

  const handlePropertyClick = (prop:any,value:any)=>{
     setCurrentField(null);
     setPropertyValue(prop,value);
     setFieldValues([]);
  }

  let selectedCategory = categories.find(cat => cat.id == value);
  const floorDisabled =  selectedCategory ? selectedCategory.type == "Guest House" : false;

  const values = fieldValues.filter((value)=>{
    return currentField && value.value.includes(getPropertyValue(currentField.key));
  });

  return (
    <ScreenWrapper
      style={[styles.container, { backgroundColor }]}
    >

    {loading ? 
    <View style={styles.loader} >
      <ActivityIndicator size="large" />
    </View> :

    <ScrollView>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Fill the form and add the respective details to create an asset.
        </ThemedText>
      <ThemedView style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <ThemedView>
          <ThemedText type="label">Select Asset Type</ThemedText>
          <Dropdown
            style={styles.dropdown}
            data={categories}

            maxHeight={300}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            labelField="type"
            valueField="id"
            placeholder={'Select type'}
            searchPlaceholder="Search..."
            value={value}
            onChange={item => {
              setValue(item.id);
            }}
          />
        </ThemedView>

        {/* <ThemedView>
          <ThemedText type="label">Asset Tag</ThemedText>
          <ThemedInputText
            onChangeText={(v) => setPropertyValue("assetTag", v)}
            value={getPropertyValue('assetTag')}
            placeholder="Enter asset tag"
            placeholderTextColor="#8A959F"
          />
        </ThemedView> */}

        <ThemedView>
          <ThemedText type="label">Select asset status</ThemedText>
          <Dropdown
            style={styles.dropdown}
            data={data}
            maxHeight={300}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            labelField="label"
            valueField="value"
            placeholder={'Select status'}
            searchPlaceholder="Search..."
            value={getPropertyValue('status')}
            onChange={item => {
              setPropertyValue('status', item.value);
            }}
          />
        </ThemedView>

        {!floorDisabled &&  <ThemedView>
          <ThemedText type="label">Select floor</ThemedText>
            <Dropdown
            style={styles.dropdown}
            data={FLOORS}
            maxHeight={300}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            labelField="label"
            valueField="value"
            placeholder={'Select Floor'}
            searchPlaceholder="Search..."
            value={getPropertyValue('floor')}
            onChange={item => {
              // console.log(properties);
              setPropertyValue('floor', item.value);
            }}          
          />
        </ThemedView> }

        {categoryProperties.map((item,idx:number) => {
          let scrollHeight = Math.min(300, (categoryProperties.length - idx )*60);
          return <ThemedView key={item.id} style={{position:'relative'}}>
            <ThemedText type="label">{item.key}</ThemedText>
            <ThemedInputText
              onPress={()=>{
                if(currentField?.id == item.id) {
                  setCurrentField(null);
                }else{
                  setCurrentField(item)                  
                }
                setFieldValues([]);

              }}
              onChangeText={(v) => setPropertyValue(item.key, v)}
              value={getPropertyValue(item.key)}
              placeholder={`Enter ${item.key}`}
              placeholderTextColor="#8A959F"
            />
            {currentField?.id == item.id && values.length ?

            <ThemedView style={{position:"absolute",top:"100%",zIndex:1,width:"100%", borderWidth: 0.5,
              borderColor: Colors.primaryDropdown.inputBg }}>
                <ScrollView nestedScrollEnabled style={{maxHeight: scrollHeight}}>
              <KeyboardAvoidingView>
                  {
                    values.map((value,idx) => (
                      <ThemedView  key={idx}>
                        <TouchableOpacity onPress={()=>handlePropertyClick(item.key,value.value)}>
                          <ThemedText style={{padding: 15,
                              textAlign: 'left',
                              borderWidth: 0.5,
                              borderColor: Colors.primaryDropdown.inputBg,
                              borderRadius: 2,
                              color : Colors.light.text,
                            }} type='label'>{value.value}</ThemedText>
                        </TouchableOpacity>
                      </ThemedView>
                    ))
                  }
                  <ThemedView>
                    
                  </ThemedView>
              </KeyboardAvoidingView>
                </ScrollView>
            </ThemedView>:null}
            
          </ThemedView>;
        })}

  
        <TouchableOpacity onPress={() => {
          handleSave();
        }} style={{ ...styles.btn }}>
          <ThemedText style={styles.save}>
            Create QR
          </ThemedText>
        </TouchableOpacity></ThemedView>
    </ScrollView>
    }
    {/* {currentField!='' && 
      <TouchableWithoutFeedback style={{position:"absolute"}} onPress={()=>{ console.log("current");setCurrentField("")}}>
          <ThemedView style={{height:height,backgroundColor:"#ff00008f",width:width}}>
          </ThemedView>
      </TouchableWithoutFeedback>
    } */}
    </ScreenWrapper>
  );
}

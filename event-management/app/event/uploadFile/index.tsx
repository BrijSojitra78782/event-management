import React, { useState } from 'react';
import { View, Text, Button, Platform, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { fileUpload } from "../services/eventServices";
import { useSession } from "@/context/UserSessionContext";

export default function UploadFilePage() {
 const { token,signOut } = useSession();
 const [file, setFile] = useState(null);

 const handleFilePick = async (e : any) => {
  setFile(e.target.files[0]);
  console.log(e.target.files[0]);
 };

 const handleSubmit = async (e : any) => {
  e.preventDefault();
  if (!file) {
   alert("Please select a file first.");
   return;
  }
  const result = fileUpload(file, token);
  console.log("result :- ",result);
 };

 return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
   <form onSubmit={handleSubmit} encType="multipart/form-data"> 
    <input type="file" name="file" onChange={handleFilePick}/> 
    <input type="submit" value="Upload File"/>
   </form>
  </View>
 );
}
import React from "react"
import {FirebaseRecaptchaVerifierModal} from "expo-firebase-recaptcha"

import Constants from "expo-constants";

export default function FirebaseRecapcha(props) {
    const { referencia } = props;

    return (
        <FirebaseRecaptchaVerifierModal
            ref={referencia}
            title="CONFIRMA QUE NO ERES UN ROBOX"
            cancelLabel="x"
            firebaseConfig={Constants.manifest.extra.firebase}
        />
    );
}

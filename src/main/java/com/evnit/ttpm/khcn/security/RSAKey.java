/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.evnit.ttpm.khcn.security;

import org.apache.commons.codec.binary.Base64;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

public class RSAKey {

    public static PrivateKey getPrivateKey(String privateKey) {
        try {
            // Base64 decode the result
            byte[] pkcs8EncodedBytes = Base64.decodeBase64(privateKey);
            // extract the private key
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(pkcs8EncodedBytes);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            PrivateKey privKey = kf.generatePrivate(keySpec);
            return privKey;
        } catch (Exception e) {
            return null;
        }
    }

    public static PublicKey getPublicKey(String publicKey) {
        try {
            byte[] pkcs8EncodedBytes = Base64.decodeBase64(publicKey);
            X509EncodedKeySpec keySpecX509 = new X509EncodedKeySpec(pkcs8EncodedBytes);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            PublicKey pubKey = kf.generatePublic(keySpecX509);
            return pubKey;
        } catch (Exception e) {
            return null;
        }

    }

}

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.evnit.ttpm.khcn.security.services;

import org.springframework.security.core.context.SecurityContextHolder;

/**
 *
 * @author Admin
 */
public class SecurityUtils {

    public static UserDetailsImpl getPrincipal() {
        return (UserDetailsImpl) (SecurityContextHolder.getContext()).getAuthentication().getPrincipal();
    }
}

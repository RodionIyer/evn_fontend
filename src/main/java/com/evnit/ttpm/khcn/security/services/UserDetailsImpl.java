package com.evnit.ttpm.khcn.security.services;

import com.evnit.ttpm.khcn.models.admin.Q_User;
import com.evnit.ttpm.khcn.models.system.FunctionGrant;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class UserDetailsImpl implements UserDetails {

    private static final long serialVersionUID = 1L;

    private String userId;

    private final String username;

    private String descript;

    private String userIdhrms;
    private String ORGID;
    private String ORGDESC;
    private Boolean local;

    @JsonIgnore
    private final String password;

    private final Boolean enable;

    private final Collection<? extends GrantedAuthority> authorities;

    private List<FunctionGrant> fgrant;

    public UserDetailsImpl(String userId, String username, String descript, String userIdhrms, String ORGID, String ORGDESC, Boolean local, String password, Boolean enable,
            Collection<? extends GrantedAuthority> authorities, List<FunctionGrant> fgrant) {
        this.userId = userId;
        this.username = username;
        this.descript = descript;
        this.userIdhrms = userIdhrms;
        this.ORGID = ORGID;
        this.ORGDESC = ORGDESC;
        this.local = local;
        this.password = password;
        this.enable = enable;
        this.authorities = authorities;
        this.fgrant = fgrant;
    }

    public static UserDetailsImpl build(Q_User user, List<FunctionGrant> fgrant) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleId()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(
                user.getUserid(),
                user.getUsername(),
                user.getDescript(),
                user.getUserIdhrms(),
                user.getORGID(),
                user.getORGDESC(),
                user.getLocal(),
                user.getPassword(),
                user.getEnable(),
                authorities, fgrant);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enable;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDescript() {
        return descript;
    }

    public String getUserIdhrms() {
        return userIdhrms;
    }

    public void setUserIdhrms(String userIdhrms) {
        this.userIdhrms = userIdhrms;
    }

    public String getORGID() {
        return ORGID;
    }

    public void setORGID(String ORGID) {
        this.ORGID = ORGID;
    }

    public String getORGDESC() {
        return ORGDESC;
    }

    public void setORGDESC(String ORGDESC) {
        this.ORGDESC = ORGDESC;
    }

    public Boolean getLocal() {
        return local;
    }

    public void setLocal(Boolean local) {
        this.local = local;
    }

    public void setDescript(String descript) {
        this.descript = descript;
    }

    public List<FunctionGrant> getFgrant() {
        return fgrant;
    }

    public void setFgrant(List<FunctionGrant> fgrant) {
        this.fgrant = fgrant;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(userId, user.userId);
    }

}

package com.openclassrooms.starterjwt.payload.request;

import javax.validation.constraints.*;

import lombok.Data;


public class SignupRequest {
  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  @NotBlank
  @Size(min = 3, max = 20)
  private String firstName;

  @NotBlank
  @Size(min = 3, max = 20)
  private String lastName;

  @NotBlank
  @Size(min = 6, max = 40)
  private String password;


  public SignupRequest() {
  }

  public SignupRequest(@NotBlank @Size(max = 50) @Email String email,
      @NotBlank @Size(min = 3, max = 20) String firstName, @NotBlank @Size(min = 3, max = 20) String lastName,
      @NotBlank @Size(min = 6, max = 40) String password) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  
}

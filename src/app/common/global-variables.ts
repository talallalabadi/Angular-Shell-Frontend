import { Component, OnInit } from '@angular/core';

export class GlobalVariables {
  public static userEmail;
  public static companyName = 'DigiClips';

  setUserEmail(email) {
    GlobalVariables.userEmail = email;
  }

  getUserEmail() {
    return GlobalVariables.userEmail;
  }
}

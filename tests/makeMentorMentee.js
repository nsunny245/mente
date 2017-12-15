//flow manipulation stuff happens here
const flow = browser.controlFlow();
const HALT = () => {
  browser.sleep(10000);
}

//database query spec
var MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017/test";
const EC = protractor.ExpectedConditions;

//user testing spec
const randNum = Math.floor((Math.random() * 1000) + 1);
const menteeUser = 'testermentee' + randNum + "@mailee.com";
const mentorUser = 'testermentor' + randNum + "@mailor.com";

describe('program signup flow', () => {
  it('should create a mentee / mentor pair, and then match them up', () => {
    navToSignup();
    createUser(menteeUser);
    flow.execute(() => {
      return verifyUser(menteeUser)
    });
    createMentee();
    browser.wait(EC.urlContains('timeline'), 5000);

    HALT();
  })
})

function signOut() {

}

function navToSignup() {
  browser.get('http://localhost:8080');
  element(by.css(' [ng-click="open()"] ')).click();
  element(by.css('.modal-body a.standard-button.hollow')).click();
}

//create a generic user
function createUser(email) {
  modelKey('profile.username', 'Tester' + randNum);
  modelKey('profile.email', email);
  modelKey(['profile.password', 'confirm'], 'password');
  element(by.css("label.checkbox")).click();

  browser.element(by.css('.signup-css button.standard-button[type="submit"]')).click();
  browser.wait(EC.urlContains('mentorship'), 5000);
}

function createMentee() {
  browser.wait(EC.urlContains('mentorship'), 5000);

  browser.element.all(by.css('.signup-select-css .type-card a.standard-button')).first().click();

  browser.element(by.cssContainingText('.signup-info-css a.standard-button', 'Continue')).click();

  fillMenteeForm();
}

function fillMenteeForm() {
  //signup 
  browser.wait(EC.urlContains('mentee-form'), 5000);

  modelKey('profile.firstName', 'First');
  modelKey('profile.middleName', 'Middle');
  modelKey('profile.lastName', 'Middle');

  modelKey('profile.schoolName', 'George Brown College');

  modelKey('profile.schoolEmail', 'mentee@gbc.ca');

  element(by.css(".signup-mentorship-css .section label.checkbox")).click();

  modelKey('profile.age', '19');
  modelKey('profile.study', 'Engineering');
  modelKey('profile.currentField', 'Industry');

  modelKey('profile.why', 'why I decided to join the mentorship program');

  element(by.css("#interest > fieldset:nth-child(4) > label:nth-child(3) > span:nth-child(2)")).click();

  modelKey('profile.biggestChallenge', 'Mentees biggest challenge');
  element(by.css("#interest > fieldset:nth-child(7) > label:nth-child(2) > span:nth-child(2)")).click();

  modelKey('profile.share', 'Mentees thing to share');

  for (let i = 3; i < 8; i++) {
    element(by.css("#declarations > label:nth-child(" + i + ") > span:nth-child(2)")).click();
  }

  browser.element(by.css('.signup-mentorship-css button.standard-button[type="submit"]')).click();
}

function completeMenteeModules() {

}

function verifyUser(userEmail) {
  const deferred = protractor.promise.defer();

  console.log("attempting to verify user");
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log("ERROR: ", err);
      deferred.reject();
    }
    console.log("connection established, trying to find " + userEmail);

    var collection = db.collection('userprofiles');

    collection.updateOne({ 'email': userEmail }, { $set: { 'status': 'verified' } }, (err, user) => {
      if (err) {
        console.log('Error!', err);
        return deferred.reject();
      }
      console.log(user);
      return deferred.fulfill();
    })
    db.close();
  })
  return deferred.promise;
}

function modelClick(model) {
  if (Array.isArray(model)) {
    for (m of model) {
      element(by.model(m)).click();
    }
  } else {
    element(by.model(model)).click();
  }
}

function modelKey(model, keys) {
  if (Array.isArray(model)) {
    for (m of model) {
      element(by.model(m)).sendKeys(keys);
    }
  } else {
    element(by.model(model)).sendKeys(keys);
  }
}
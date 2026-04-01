import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Set "mo:core/Set";

import AccessControl "authorization/access-control";

module {
  type Level = { #beginner; #intermediate; #advanced };
  type Course = { id : Nat; title : Text; description : Text; level : Level };
  type Chapter = { id : Nat; courseId : Nat; title : Text; content : Text; order : Nat };
  type UserProfile = { name : Text };

  type Certificate = {
    certificateId : Text;
    username : Text;
    fullName : Text;
    email : Text;
    courseId : Text;
    courseName : Text;
    issuedAt : Int;
    revokedAt : ?Int;
  };

  type TrainingResource = {
    id : Text;
    courseLevel : Text;
    title : Text;
    description : Text;
    resourceType : Text;
    url : ?Text;
    content : ?Text;
    fileName : ?Text;
    uploadedAt : Int;
    isActive : Bool;
  };

  type AuditLog = {
    id : Text;
    timestamp : Int;
    actorId : Text;
    actorType : Text;
    action : Text;
    details : Text;
    resource : Text;
  };

  type OldUserAccount = {
    username : Text;
    fullName : Text;
    email : Text;
    passwordHash : Text;
    phone : Text;
    address : Text;
    profileBio : Text;
    reason : Text;
    createdAt : Int;
    isDisabled : Bool;
    enrolledCourse : ?Text;
    assessmentScore : ?Nat;
    assessmentPassed : ?Bool;
  };

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    courses : Map.Map<Nat, Course>;
    chapters : Map.Map<Nat, Chapter>;
    nextCourseId : Nat;
    nextChapterId : Nat;
    enrollments : Map.Map<Principal.Principal, Set.Set<Nat>>;
    completedChapters : Map.Map<Principal.Principal, Set.Set<Nat>>;
    userAccounts : Map.Map<Text, OldUserAccount>;
    emailIndex : Map.Map<Text, Text>;
  };

  type NewUserAccount = OldUserAccount;

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    courses : Map.Map<Nat, Course>;
    chapters : Map.Map<Nat, Chapter>;
    nextCourseId : Nat;
    nextChapterId : Nat;
    enrollments : Map.Map<Principal.Principal, Set.Set<Nat>>;
    completedChapters : Map.Map<Principal.Principal, Set.Set<Nat>>;
    certificates : Map.Map<Text, Certificate>;
    trainingResources : Map.Map<Text, TrainingResource>;
    auditLogs : List.List<AuditLog>;
    usernameToPrincipal : Map.Map<Text, Principal.Principal>;
    userAccounts : Map.Map<Text, NewUserAccount>;
    emailIndex : Map.Map<Text, Text>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      certificates = Map.empty<Text, Certificate>();
      trainingResources = Map.empty<Text, TrainingResource>();
      auditLogs = List.empty<AuditLog>();
      usernameToPrincipal = Map.empty<Text, Principal.Principal>();
    };
  };
};


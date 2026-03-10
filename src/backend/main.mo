import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Set "mo:core/Set";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  ///////////////////////////
  // Data Types and Modules
  ///////////////////////////

  public type UserProfile = {
    name : Text;
  };

  type Course = {
    id : Nat;
    title : Text;
    description : Text;
    level : Level;
  };

  type Chapter = {
    id : Nat;
    courseId : Nat;
    title : Text;
    content : Text;
    order : Nat;
  };

  type Level = {
    #beginner;
    #intermediate;
    #advanced;
  };

  module Course {
    public func compare(lhs : Course, rhs : Course) : Order.Order {
      Text.compare(lhs.title, rhs.title);
    };
  };

  module Chapter {
    public func compare(lhs : Chapter, rhs : Chapter) : Order.Order {
      switch (Nat.compare(lhs.courseId, rhs.courseId)) {
        case (#equal) { Nat.compare(lhs.order, rhs.order) };
        case (nonEqual) { nonEqual };
      };
    };
  };

  ///////////////////
  // User Profiles
  ///////////////////
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  ///////////////////
  // Course Storage
  ///////////////////
  let courses = Map.empty<Nat, Course>();
  let chapters = Map.empty<Nat, Chapter>();

  ////////////
  // Progress
  ////////////
  let enrollments = Map.empty<Principal, Set.Set<Nat>>(); // user -> set of courseIds
  let completedChapters = Map.empty<Principal, Set.Set<Nat>>(); // user -> set of chapterIds

  var nextCourseId = 1;
  var nextChapterId = 1;

  ////////////
  // Courses
  ////////////

  public shared ({ caller }) func addCourse(title : Text, description : Text, level : Level) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add courses");
    };
    let id = nextCourseId;
    nextCourseId += 1;

    let course : Course = {
      id;
      title;
      description;
      level;
    };
    courses.add(id, course);
    id;
  };

  public shared ({ caller }) func updateCourse(courseId : Nat, title : Text, description : Text, level : Level) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update courses");
    };

    if (not courses.containsKey(courseId)) { Runtime.trap("Course does not exist") };
    let updatedCourse : Course = {
      id = courseId;
      title;
      description;
      level;
    };
    courses.add(courseId, updatedCourse);
  };

  public shared ({ caller }) func deleteCourse(courseId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete courses");
    };
    if (not courses.containsKey(courseId)) { Runtime.trap("Course does not exist") };
    courses.remove(courseId);
  };

  /////////////
  // Chapters
  /////////////

  public shared ({ caller }) func addChapter(courseId : Nat, title : Text, content : Text, order : Nat) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add chapters");
    };

    if (not courses.containsKey(courseId)) { Runtime.trap("Course does not exist") };

    let id = nextChapterId;
    nextChapterId += 1;

    let chapter : Chapter = { id; courseId; title; content; order };
    chapters.add(id, chapter);
    id;
  };

  public shared ({ caller }) func updateChapter(chapterId : Nat, courseId : Nat, title : Text, content : Text, order : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update chapters");
    };

    if (not chapters.containsKey(chapterId)) { Runtime.trap("Chapter does not exist") };
    let updatedChapter : Chapter = { id = chapterId; courseId; title; content; order };
    chapters.add(chapterId, updatedChapter);
  };

  public shared ({ caller }) func deleteChapter(chapterId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete chapters");
    };
    if (not chapters.containsKey(chapterId)) { Runtime.trap("Chapter does not exist") };
    chapters.remove(chapterId);
  };

  /////////////////////////
  // Enrollment & Progress
  /////////////////////////

  public shared ({ caller }) func enrollInCourse(courseId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can enroll in courses");
    };

    switch (courses.get(courseId)) {
      case (null) { Runtime.trap("Course does not exist") };
      case (?_course) {
        let currentEnrollments = switch (enrollments.get(caller)) {
          case (null) { Set.empty<Nat>() };
          case (?e) { e };
        };

        if (currentEnrollments.contains(courseId)) {
          Runtime.trap("Already enrolled");
        } else {
          currentEnrollments.add(courseId);
          enrollments.add(caller, currentEnrollments);
        };
      };
    };
  };

  public shared ({ caller }) func markChapterComplete(chapterId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark chapters complete");
    };

    if (not chapters.containsKey(chapterId)) { Runtime.trap("Chapter does not exist") };
    let currentProgress = switch (completedChapters.get(caller)) {
      case (null) { Set.empty<Nat>() };
      case (?p) { p };
    };
    currentProgress.add(chapterId);
    completedChapters.add(caller, currentProgress);
  };

  /////////////////////////
  // Query Functions
  /////////////////////////

  public query ({ caller }) func getAllCourses() : async [Course] {
    courses.values().toArray();
  };

  public query ({ caller }) func getChaptersByCourse(courseId : Nat) : async [Chapter] {
    if (not courses.containsKey(courseId)) { Runtime.trap("Course does not exist") };
    chapters.values().toArray().filter(func(chap) { chap.courseId == courseId }).sort();
  };

  public query ({ caller }) func getCourseEnrollments() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their enrollments");
    };

    switch (enrollments.get(caller)) {
      case (null) { [] };
      case (?e) { e.toArray() };
    };
  };

  public query ({ caller }) func getCompletedChapters() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their progress");
    };

    switch (completedChapters.get(caller)) {
      case (null) { [] };
      case (?c) { c.toArray() };
    };
  };

  public query ({ caller }) func getCallerCourseProgress(courseId : Nat) : async {
    enrolled : Bool;
    completedChapters : [Nat];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their progress");
    };

    let userEnrollments = switch (enrollments.get(caller)) {
      case (null) { Set.empty<Nat>() };
      case (?e) { e };
    };
    let isEnrolled = userEnrollments.contains(courseId);

    let userChapters = switch (completedChapters.get(caller)) {
      case (null) { Set.empty<Nat>() };
      case (?c) { c };
    };
    let completed = chapters.values().toArray().filter(func(chap) { chap.courseId == courseId }).map(
      func(chap) { if (userChapters.contains(chap.id)) { chap.id } else { 0 } }
    );

    {
      enrolled = isEnrolled;
      completedChapters = completed.filter(func(id) { id != 0 });
    };
  };

  public query ({ caller }) func getUserCourseProgress(user : Principal, courseId : Nat) : async {
    enrolled : Bool;
    completedChapters : [Nat];
  } {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own progress or admin can view any");
    };

    let userEnrollments = switch (enrollments.get(user)) {
      case (null) { Set.empty<Nat>() };
      case (?e) { e };
    };
    let isEnrolled = userEnrollments.contains(courseId);

    let userChapters = switch (completedChapters.get(user)) {
      case (null) { Set.empty<Nat>() };
      case (?c) { c };
    };
    let completed = chapters.values().toArray().filter(func(chap) { chap.courseId == courseId }).map(
      func(chap) { if (userChapters.contains(chap.id)) { chap.id } else { 0 } }
    );

    {
      enrolled = isEnrolled;
      completedChapters = completed.filter(func(id) { id != 0 });
    };
  };

  /////////////////////////
  // Admin Functions
  /////////////////////////

  public query ({ caller }) func getAllUsers() : async [Principal] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can list all users");
    };
    enrollments.keys().toArray();
  };

  public query ({ caller }) func getAllEnrollments() : async [(Principal, [Nat])] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can list all enrollments");
    };
    enrollments.entries().toArray().map(func((user, courseSet)) {
      (user, courseSet.toArray());
    });
  };
};

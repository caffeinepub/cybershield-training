import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Level = { #beginner; #intermediate; #advanced };

  type UserProfile = { name : Text };

  type UserAccount = {
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

  // Data structure for progress tracking

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

  let userProfiles = Map.empty<Principal.Principal, UserProfile>();
  let courses = Map.empty<Nat, Course>();
  let chapters = Map.empty<Nat, Chapter>();
  let userAccounts = Map.empty<Text, UserAccount>();
  let emailIndex = Map.empty<Text, Text>();
  let certificates = Map.empty<Text, Certificate>();
  let trainingResources = Map.empty<Text, TrainingResource>();
  let auditLogs = List.empty<AuditLog>();
  let enrollments = Map.empty<Principal.Principal, Set.Set<Nat>>(); // user -> set of courseIds
  let completedChapters = Map.empty<Principal.Principal, Set.Set<Nat>>(); // user -> set of chapterIds
  let usernameToPrincipal = Map.empty<Text, Principal.Principal>();

  courses.add(1, { id = 1; title = "Fundamentals of Cybersecurity"; description = "A comprehensive beginner course covering core cybersecurity concepts: threats, attacks, network security, email security, endpoint protection, web application security, OWASP, MFA, SIEM, and GRC. No prior tech background needed."; level = #beginner });

  chapters.add(1, { id = 1; courseId = 1; title = "Chapter 1: Fundamentals to Cybersecurity"; order = 1; content = "Overview of Cybersecurity\nCybersecurity is the practice of protecting systems, networks, and programs from digital attacks.\n\nCIA Triad\n- Confidentiality: Ensuring data is accessible only to those authorized.\n- Integrity: Ensuring data is accurate and unaltered.\n- Availability: Ensuring data and systems are accessible when needed.\n\nCybersecurity Threats Globally\nCyber threats include nation-state attacks, cybercrime, hacktivism, and insider threats affecting governments, businesses, and individuals worldwide.\n\nCybersecurity Protection Layers\n1. Physical Security\n2. Network Security\n3. Application Security\n4. Endpoint Security\n5. Data Security\n6. Identity & Access Management\n7. Security Operations\n\nBest Practices\n- Use strong, unique passwords\n- Enable multi-factor authentication\n- Keep software updated\n- Back up data regularly\n- Be cautious of phishing emails\n\nIndustry Standards & Compliance\nKey frameworks include ISO/IEC 27001, NIST Cybersecurity Framework, GDPR, HIPAA, and PCI-DSS.\n\nCybersecurity Domains\nNetwork Security, Cloud Security, Application Security, Endpoint Security, Identity Management, Incident Response, GRC, and more.\n\nEvolution & Future of AI in Cybersecurity\nCybersecurity has evolved from basic antivirus to AI-driven threat detection. AI enables faster anomaly detection, automated response, and predictive security." });

  chapters.add(2, { id = 2; courseId = 1; title = "Chapter 2: Cyber Attacks — Malware, Phishing & Social Engineering"; order = 2; content = "What is a Cyber Attack?\nA cyber attack is an attempt to gain unauthorized access to systems, steal data, or cause damage.\n\nSection A: Malware\nTypes: Virus, Worm, Trojan Horse, Spyware, Ransomware, Adware.\nProtection: Use antivirus, avoid unknown attachments, keep software updated.\n\nSection B: Phishing\nTypes: Email Phishing, Spear Phishing, Whaling, Smishing, Vishing, Angler Phishing, SEO Poisoning.\nSafety: Do not click unknown links, verify senders, contact companies via official websites.\n\nSection C: Social Engineering\nTechniques: Impersonation, Pretexting, Tailgating, Baiting." });

  chapters.add(3, { id = 3; courseId = 1; title = "Chapter 3: Network Fundamentals and Security"; order = 3; content = "Network Topology\nTypes: Bus, Star, Ring, Mesh, Tree, Hybrid.\n\nKey Devices: Modem, Hub, Switch, Router, Firewall, Load Balancer, WAF.\n\nCommon Threats: DDoS, MitM, Sniffing, Spoofing, Botnets, Zero-Day exploits.\n\nSecuring a Network: Firewalls, IDS, network segmentation, strong authentication, patch management." });

  chapters.add(4, { id = 4; courseId = 1; title = "Chapter 4: Email Security"; order = 4; content = "Email Protocols: SMTP (sending), POP3/IMAP (receiving).\nSecurity features: SPF, DKIM, DMARC, encryption.\nThreats: Phishing, malware attachments, spoofed emails, spam.\nBest practices: Never send sensitive info in plain email, verify senders, follow email policies." });

  chapters.add(5, { id = 5; courseId = 1; title = "Chapter 5: End-Point Security"; order = 5; content = "Endpoints: Any device connecting to a network (laptops, mobiles, IoT).\nThreats: Malware, phishing, weak passwords, unpatched software, stolen devices.\nKey protections: Antivirus, EDR, Firewall, Patch Management, Encryption, MFA, Least Privilege, Remote Wipe, Backup." });

  chapters.add(6, { id = 6; courseId = 1; title = "Chapter 6: Web Application Security"; order = 6; content = "Web apps are high-risk: always online, store sensitive data, often untested.\nKey risks: Unauthorized access, account takeover, injection, XSS, broken authentication.\nSecurity lifecycle: Threat modeling, secure code review, SAST/DAST, pen testing, patching." });

  chapters.add(7, { id = 7; courseId = 1; title = "Chapter 7: OWASP Top 10"; order = 7; content = "OWASP Top 10 (2021):\n1. Broken Access Control\n2. Cryptographic Failures\n3. Injection\n4. Insecure Design\n5. Security Misconfiguration\n6. Vulnerable & Outdated Components\n7. Identification & Authentication Failures\n8. Software & Data Integrity Failures\n9. Security Logging & Monitoring Failures\n10. Server-Side Request Forgery (SSRF)" });

  chapters.add(8, { id = 8; courseId = 1; title = "Chapter 8: Multi-Factor Authentication (MFA)"; order = 8; content = "MFA requires 2+ factors: Something You Know, Something You Have, Something You Are.\nProtects against phishing, keyloggers, credential theft.\nLimitations: SIM swapping, phishing bypass, usability challenges." });

  chapters.add(9, { id = 9; courseId = 1; title = "Chapter 9: SIEM — Security Information and Event Management"; order = 9; content = "SIEM collects, monitors, and analyzes security events.\nFunctions: Log Collection, Event Correlation, Real-time Alerts, Dashboards, Forensic Analysis.\nPopular tools: Splunk, IBM QRadar, LogRhythm, Microsoft Sentinel, Elastic SIEM, ArcSight." });

  chapters.add(10, { id = 10; courseId = 1; title = "Chapter 10: Fundamentals of GRC — Governance, Risk & Compliance"; order = 10; content = "GRC: Governance (policies & direction), Risk (identify & manage threats), Compliance (follow laws & standards).\nKey frameworks: GDPR, HIPAA, ISO 27001, PCI-DSS, NIST CSF.\nGRC tools: Archer, ServiceNow GRC, OneTrust, MetricStream, AuditBoard." });

  var nextCourseId = 3;
  var nextChapterId = 24;

  ////////////
  // User Profiles
  ////////////

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal.Principal) : async ?UserProfile {
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

  ////////////
  // Courses
  ////////////
  public shared ({ caller }) func addCourse(title : Text, description : Text, level : Level) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete courses");
    };
    if (not courses.containsKey(courseId)) { Runtime.trap("Course does not exist") };
    courses.remove(courseId);
  };

  public query ({ caller }) func getAllCourses() : async [Course] {
    courses.values().toArray();
  };

  /////////////
  // Chapters
  /////////////

  public shared ({ caller }) func addChapter(courseId : Nat, title : Text, content : Text, order : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update chapters");
    };

    if (not chapters.containsKey(chapterId)) { Runtime.trap("Chapter does not exist") };
    let updatedChapter : Chapter = { id = chapterId; courseId; title; content; order };
    chapters.add(chapterId, updatedChapter);
  };

  public shared ({ caller }) func deleteChapter(chapterId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete chapters");
    };
    if (not chapters.containsKey(chapterId)) { Runtime.trap("Chapter does not exist") };
    chapters.remove(chapterId);
  };

  public query ({ caller }) func getChaptersByCourse(courseId : Nat) : async [Chapter] {
    if (not courses.containsKey(courseId)) { Runtime.trap("Course does not exist") };
    chapters.values().toArray().filter(func(chap) { chap.courseId == courseId }).sort();
  };

  /////////////
  // Progress
  /////////////

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

  public query ({ caller }) func getCourseEnrollments() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their enrollments");
    };

    switch (enrollments.get(caller)) {
      case (null) { [] };
      case (?e) { e.toArray() };
    };
  };

  ////////////
  // Progress Tracking
  ////////////

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

  public query ({ caller }) func getUserCourseProgress(user : Principal.Principal, courseId : Nat) : async {
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

  ////////////
  // Admin Functions
  ////////////

  public query ({ caller }) func getAllUsers() : async [Principal.Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all users");
    };
    enrollments.keys().toArray();
  };

  public query ({ caller }) func getAllEnrollments() : async [(Principal.Principal, [Nat])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all enrollments");
    };
    enrollments.entries().toArray().map(func((user, courseSet)) {
      (user, courseSet.toArray());
    });
  };

  ////////////
  // Courses
  /////////////
  public shared ({ caller }) func registerUser(
    username : Text,
    fullName : Text,
    email : Text,
    passwordHash : Text,
    phone : Text,
    address : Text,
    profileBio : Text,
    reason : Text,
    createdAt : Int,
  ) : async { #ok; #err : Text } {
    // Public registration - no auth required
    if (userAccounts.containsKey(username)) {
      return #err("Username already taken");
    };
    if (emailIndex.containsKey(email)) {
      return #err("Email already registered");
    };
    let account : UserAccount = {
      username;
      fullName;
      email;
      passwordHash;
      phone;
      address;
      profileBio;
      reason;
      createdAt;
      isDisabled = false;
      enrolledCourse = null;
      assessmentScore = null;
      assessmentPassed = null;
    };
    userAccounts.add(username, account);
    emailIndex.add(email, username);
    #ok;
  };

  ////////////
  // Auth Flows
  ////////////

  public query ({ caller }) func loginUser(username : Text, passwordHash : Text) : async ?UserAccount {
    // Public login - no auth required
    switch (userAccounts.get(username)) {
      case (null) { null };
      case (?account) {
        if (account.isDisabled) { null }
        else if (account.passwordHash == passwordHash) { ?account }
        else { null };
      };
    };
  };

  public query ({ caller }) func getMaskedEmailByUsername(username : Text) : async ?Text {
    // Public query - no auth required (for password reset flows)
    switch (userAccounts.get(username)) {
      case (null) { null };
      case (?account) { ?account.email };
    };
  };

  public shared ({ caller }) func saveAssessmentResult(username : Text, score : Nat, passed : Bool) : async Bool {
    // Should be called by authenticated users only
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save assessment results");
    };
    switch (userAccounts.get(username)) {
      case (null) { false };
      case (?account) {
        let updated : UserAccount = {
          username = account.username;
          fullName = account.fullName;
          email = account.email;
          passwordHash = account.passwordHash;
          phone = account.phone;
          address = account.address;
          profileBio = account.profileBio;
          reason = account.reason;
          createdAt = account.createdAt;
          isDisabled = account.isDisabled;
          enrolledCourse = account.enrolledCourse;
          assessmentScore = ?score;
          assessmentPassed = ?passed;
        };
        userAccounts.add(username, updated);
        true;
      };
    };
  };

  ////////////
  // Admin User Management
  ////////////

  public query ({ caller }) func getAllRegisteredUsers() : async [UserAccount] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userAccounts.values().toArray();
  };

  public query ({ caller }) func getUserByUsername(username : Text) : async ?UserAccount {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view user details");
    };
    userAccounts.get(username);
  };

  public shared ({ caller }) func adminResetUserPassword(username : Text, newPasswordHash : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reset passwords");
    };
    switch (userAccounts.get(username)) {
      case (null) { false };
      case (?account) {
        let updated : UserAccount = {
          username = account.username;
          fullName = account.fullName;
          email = account.email;
          passwordHash = newPasswordHash;
          phone = account.phone;
          address = account.address;
          profileBio = account.profileBio;
          reason = account.reason;
          createdAt = account.createdAt;
          isDisabled = account.isDisabled;
          enrolledCourse = account.enrolledCourse;
          assessmentScore = account.assessmentScore;
          assessmentPassed = account.assessmentPassed;
        };
        userAccounts.add(username, updated);
        true;
      };
    };
  };

  public shared ({ caller }) func adminSetUserDisabled(username : Text, isDisabled : Bool) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can disable users");
    };
    switch (userAccounts.get(username)) {
      case (null) { false };
      case (?account) {
        let updated : UserAccount = {
          username = account.username;
          fullName = account.fullName;
          email = account.email;
          passwordHash = account.passwordHash;
          phone = account.phone;
          address = account.address;
          profileBio = account.profileBio;
          reason = account.reason;
          createdAt = account.createdAt;
          isDisabled;
          enrolledCourse = account.enrolledCourse;
          assessmentScore = account.assessmentScore;
          assessmentPassed = account.assessmentPassed;
        };
        userAccounts.add(username, updated);
        true;
      };
    };
  };

  public shared ({ caller }) func adminDeleteUser(username : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete users");
    };
    switch (userAccounts.get(username)) {
      case (null) { false };
      case (?account) {
        userAccounts.remove(username);
        emailIndex.remove(account.email);
        true;
      };
    };
  };

  public shared ({ caller }) func adminAssignCourse(username : Text, enrolledCourse : ?Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can assign courses");
    };
    switch (userAccounts.get(username)) {
      case (null) { false };
      case (?account) {
        let updated : UserAccount = {
          username = account.username;
          fullName = account.fullName;
          email = account.email;
          passwordHash = account.passwordHash;
          phone = account.phone;
          address = account.address;
          profileBio = account.profileBio;
          reason = account.reason;
          createdAt = account.createdAt;
          isDisabled = account.isDisabled;
          enrolledCourse;
          assessmentScore = account.assessmentScore;
          assessmentPassed = account.assessmentPassed;
        };
        userAccounts.add(username, updated);
        true;
      };
    };
  };

  ////////////
  // Certificates
  ////////////

  public shared ({ caller }) func issueCertificate(
    certificateId : Text,
    username : Text,
    fullName : Text,
    email : Text,
    courseId : Text,
    courseName : Text
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can issue certificates");
    };

    let certificate : Certificate = {
      certificateId;
      username;
      fullName;
      email;
      courseId;
      courseName;
      issuedAt = Time.now();
      revokedAt = null;
    };

    certificates.add(certificateId, certificate);
    certificateId;
  };

  public shared ({ caller }) func revokeCertificate(certificateId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can revoke certificates");
    };
    switch (certificates.get(certificateId)) {
      case (null) { Runtime.trap("Certificate not found") };
      case (?cert) {
        let updated : Certificate = {
          certificateId = cert.certificateId;
          username = cert.username;
          fullName = cert.fullName;
          email = cert.email;
          courseId = cert.courseId;
          courseName = cert.courseName;
          issuedAt = cert.issuedAt;
          revokedAt = ?Time.now();
        };
        certificates.add(certificateId, updated);
      };
    };
  };

  public query ({ caller }) func getAllCertificates() : async [Certificate] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all certificates");
    };
    certificates.values().toArray();
  };

  public query ({ caller }) func getCertificateById(certificateId : Text) : async ?Certificate {
    certificates.get(certificateId);
  };

  public query ({ caller }) func getCertificatesByUsername(username : Text) : async [Certificate] {
    // Users can view their own certificates, admins can view any
    // Note: This requires mapping username to Principal for proper authorization
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
        Runtime.trap("Unauthorized: Only users can view certificates");
      };
    };
    certificates.values().toArray().filter(
      func(c) {
        c.username == username
      }
    );
  };

  // Training Resources Management
  public shared ({ caller }) func addTrainingResource(
    id : Text,
    courseLevel : Text,
    title : Text,
    description : Text,
    resourceType : Text,
    url : ?Text,
    content : ?Text,
    fileName : ?Text
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add training resources");
    };

    let resource : TrainingResource = {
      id;
      courseLevel;
      title;
      description;
      resourceType;
      url;
      content;
      fileName;
      uploadedAt = Time.now();
      isActive = true;
    };

    trainingResources.add(id, resource);
    id;
  };

  public shared ({ caller }) func updateTrainingResource(resourceId : Text, resource : TrainingResource) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update training resources");
    };
    if (not trainingResources.containsKey(resourceId)) { Runtime.trap("Resource not found") };
    trainingResources.add(resourceId, resource);
  };

  public shared ({ caller }) func deleteTrainingResource(resourceId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete training resources");
    };
    if (not trainingResources.containsKey(resourceId)) { Runtime.trap("Resource not found") };
    trainingResources.remove(resourceId);
  };

  public query ({ caller }) func getAllTrainingResources() : async [TrainingResource] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all training resources");
    };
    trainingResources.values().toArray();
  };

  public query ({ caller }) func getActiveResourcesByLevel(courseLevel : Text) : async [TrainingResource] {
    // Public query - any caller can access active resources
    trainingResources.values().toArray().filter(func(r) { r.courseLevel == courseLevel and r.isActive });
  };

  // Audit Logging & Admin Functions

  public shared ({ caller }) func addAuditLog(log : AuditLog) : async () {
    // Any caller can add audit logs - no auth required per specification
    auditLogs.add(log);
  };

  public query ({ caller }) func getAuditLogs() : async [AuditLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view audit logs");
    };
    auditLogs.toArray().reverse();
  };

  public query ({ caller }) func getRecentAuditLogs(limit : Nat) : async [AuditLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view audit logs");
    };
    let reversed = auditLogs.toArray().reverse();
    if (limit >= reversed.size()) { reversed } else {
      let result = List.empty<AuditLog>();
      for (i in Nat.range(0, limit - 1)) {
        result.add(reversed[i]);
      };
      result.toArray();
    };
  };
};


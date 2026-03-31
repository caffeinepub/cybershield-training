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

  // Seed: Beginner Course
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

  // Seed: Intermediate Course
  courses.add(2, { id = 2; title = "Intermediate Cybersecurity"; description = "A hands-on intermediate course for those with foundational knowledge. Covers network scanning, vulnerability assessment, web application defense, OWASP deep dive, DLP, email protocols, VPN, patch management, IAM, and advanced endpoint security."; level = #intermediate });

  chapters.add(11, { id = 11; courseId = 2; title = "Chapter 1: Recap on Fundamentals to Cybersecurity"; order = 1; content = "Cybersecurity Overview & Threat Landscape\nReview of the CIA Triad, global threat landscape, bad actors, and hacker types.\n\nCybersecurity Attack Framework\nKey frameworks such as MITRE ATT&CK and the Cyber Kill Chain that map attacker behavior.\n\nDefense Mechanisms for CIA\nBest practices and layered defense strategies to protect Confidentiality, Integrity, and Availability.\n\nAlignment with Standards, Frameworks, Compliance & Laws\nISO 27001, NIST CSF, GDPR, HIPAA, PCI-DSS and how they align with cybersecurity strategy.\n\nCybersecurity Domains\nNetwork Security, Cloud Security, Application Security, Endpoint Security, IAM, Incident Response, GRC.\n\nRole and Future of AI in Cybersecurity\nAI-driven threat detection, automated incident response, predictive analytics, and adversarial AI risks." });

  chapters.add(12, { id = 12; courseId = 2; title = "Chapter 2: Network Scanning and Enumeration"; order = 2; content = "Overview of Network Scanning and Enumeration\nScanning identifies live hosts and open ports. Enumeration extracts detailed info from discovered services.\n\nNetwork Scanning using Nmap\nSteps: Host discovery, port scanning, service/version detection, OS detection, scripting with NSE.\n\nEnumeration Techniques\n- Network Enumeration: Identifying hosts, subnets, routers\n- Services Enumeration: Banners, versions, running services\n- Operating System Enumeration: OS fingerprinting\n- Web Application Enumeration: Directories, parameters, hidden files\n- Database Enumeration: DB type, version, schema discovery\n\nBest Practices & Defense\nDisable unnecessary services, use firewalls to limit port exposure, monitor for scanning activity, implement IDS/IPS." });

  chapters.add(13, { id = 13; courseId = 2; title = "Chapter 3: Vulnerability Assessment (VA) Scanning"; order = 3; content = "Overview of Vulnerability Scanning\nVA scanning systematically identifies known weaknesses in systems, applications, and networks before attackers can exploit them.\n\nVA Scanning Tools\n- Nessus: Industry-standard vulnerability scanner\n- OpenVAS: Open-source VA tool\n- Qualys: Cloud-based vulnerability management\n- Rapid7 InsightVM: Enterprise vulnerability management\n- Nikto: Web server scanner\n\nHow Scanning Protocols Work\n1. Asset Discovery: Identify systems in scope\n2. Vulnerability Detection: Match services against CVE databases\n3. Risk Scoring: CVSS scoring for severity (Critical, High, Medium, Low)\n4. Reporting: Detailed findings with remediation guidance\n5. Remediation Tracking: Follow-up scans to confirm fixes\n\nKey Concepts\n- CVE (Common Vulnerabilities and Exposures): Standardized vulnerability identifiers\n- CVSS (Common Vulnerability Scoring System): Numeric severity scoring\n- False Positives: Reported vulnerabilities that do not actually exist\n- Authenticated vs. Unauthenticated Scans: Credentialed scans yield more accurate results" });

  chapters.add(14, { id = 14; courseId = 2; title = "Chapter 4: Network Threats and Defense Mechanisms"; order = 4; content = "Network Infrastructure Fundamentals\nOSI & TCP/IP models, LAN/WAN/VPN types, IP addressing, subnetting, ports and protocols (HTTP, HTTPS, FTP, SSH, DNS), network devices (firewalls, switches, routers, IDS/IPS).\n\nCommon Network Threats\n- Man-in-the-Middle (MITM): Intercepting communications between two parties\n- DDoS: Overwhelming a system with traffic to make it unavailable\n- ARP Poisoning: Linking attacker MAC to legitimate IP\n- DNS Spoofing: Redirecting DNS queries to malicious sites\n- Packet Sniffing: Capturing unencrypted network traffic\n\nReal-World Attack Case Study\nDetailed walkthrough of a network-level attack from reconnaissance to exploitation and lateral movement.\n\nSecurity Tools & Technologies\n- Firewalls: Stateless, Stateful, Next-Generation (NGFW)\n- IDS/IPS: Signature and anomaly-based detection\n- UTM (Unified Threat Management): All-in-one security appliance\n- NAC (Network Access Control): Enforces endpoint compliance before network access\n- VPNs: IPSec, SSL/TLS, L2TP tunneling protocols\n\nNetwork Traffic Monitoring\nNetFlow analysis, anomaly detection, traffic baselining.\n\nWireless Security\nWEP (weak), WPA2, WPA3 standards. Rogue APs, Evil Twin attacks, wireless sniffing and jamming.\n\nIncident Response & Forensics\nNetwork forensics basics, PCAP file capture and analysis, incident response lifecycle, chain of custody." });

  chapters.add(15, { id = 15; courseId = 2; title = "Chapter 5: Designing and Defending Secure Web Applications"; order = 5; content = "Web Application Architecture\nClient/server model, APIs, databases. HTTP/HTTPS protocols. Cookies, sessions, authentication mechanisms. Same-Origin Policy, CORS.\n\nSecure Design & Development\n- Secure coding principles\n- Input validation & output encoding\n- Secure authentication & session controls\n- Transport Layer Security (TLS) best practices\n- Security headers: CSP, X-Frame-Options, HSTS\n\nAuthentication, Authorization & Session Security\n- Password storage: bcrypt, scrypt\n- MFA integration\n- OAuth2 and OpenID Connect\n- Session management: timeouts, cookie flags, regeneration\n\nAPI Security\nCommon API vulnerabilities: broken object-level authorization, mass assignment, excessive data exposure.\n\nWAF & Runtime Protections\nModSecurity, cloud WAFs (AWS WAF, Cloudflare), Content Security Policy (CSP), HSTS, RASP.\n\nCloud & Modern Web Security\nContainerized app security (Docker, Kubernetes), CI/CD pipeline security basics." });

  chapters.add(16, { id = 16; courseId = 2; title = "Chapter 6: Deep Dive into OWASP Top 10 Vulnerabilities"; order = 6; content = "In-depth coverage of each OWASP Top 10 vulnerability with attack mechanics, real examples, and mitigations:\n\n1. Broken Access Control — Privilege escalation, IDOR, directory traversal\n2. Cryptographic Failures — Weak algorithms, improper key management, insecure storage\n3. Injection — SQL, LDAP, OS command, XML injection techniques and defenses\n4. Insecure Design — Threat modeling, abuse cases, secure design patterns\n5. Security Misconfiguration — Default credentials, open cloud storage, verbose errors\n6. Vulnerable & Outdated Components — SCA tools, dependency management, CVE tracking\n7. Auth & Identification Failures — Credential stuffing, session fixation, brute force\n8. Software & Data Integrity Failures — Supply chain attacks, unsigned updates, CI/CD risks\n9. Logging & Monitoring Failures — Log injection, alert fatigue, SIEM integration\n10. SSRF — Internal service exposure, cloud metadata endpoint abuse, SSRF chaining" });

  chapters.add(17, { id = 17; courseId = 2; title = "Chapter 7: Defense Against Malware, Phishing & Social Engineering"; order = 7; content = "Advanced Malware Analysis\nStatic analysis (file hashes, strings, PE headers) vs. dynamic analysis (sandbox execution, behavioral monitoring).\n\nPhishing Defense\n- Email authentication (SPF, DKIM, DMARC)\n- Anti-phishing gateways and URL filtering\n- User awareness training and phishing simulations\n- Incident response for phishing attacks\n\nSocial Engineering Countermeasures\n- Security awareness programs\n- Verification procedures for sensitive requests\n- Physical security controls\n- Policies for handling unsolicited communications\n\nPrevention Solutions\n- Next-gen antivirus (NGAV) and behavioral detection\n- Email security gateways (Proofpoint, Mimecast, Microsoft Defender)\n- Web proxy and content filtering\n- Zero Trust principles applied to user access" });

  chapters.add(18, { id = 18; courseId = 2; title = "Chapter 8: Data Security and Data Loss Prevention (DLP)"; order = 8; content = "Objectives of Data Loss Prevention\nDLP prevents unauthorized access, transmission, or leakage of sensitive data — whether intentional or accidental.\n\nDLP Coverage Areas\n- Data at Rest: Files stored on endpoints, servers, cloud storage\n- Data in Motion: Data transmitted across networks\n- Data in Use: Data actively being processed or accessed\n\nTypes of DLP Solutions\n- Endpoint DLP: Monitors and controls data on devices\n- Network DLP: Inspects data leaving the network perimeter\n- Cloud DLP: Protects data in SaaS, IaaS, PaaS environments\n\nDLP Policy Configuration\n- Define sensitive data types (PII, PCI, PHI, IP)\n- Set rules for detection (regex, keywords, fingerprinting)\n- Configure actions: alert, block, quarantine, encrypt\n- Apply policies by user role, department, data classification\n\nBest Practices\n- Classify data before implementing DLP\n- Start with monitoring mode before enforcement\n- Integrate DLP with SIEM for alerting\n- Regularly review and update policies\n- Train users on data handling policies" });

  chapters.add(19, { id = 19; courseId = 2; title = "Chapter 9: Email Protocols and Defence Mechanisms"; order = 9; content = "Key Email Components\nMTA (Mail Transfer Agent), MUA (Mail User Agent), MDA (Mail Delivery Agent), mail server infrastructure.\n\nEmail Headers\nUnderstanding Received headers, Return-Path, Message-ID, X-Originating-IP to trace email origin and detect spoofing.\n\nHow Phishing Emails Are Crafted\n- Domain spoofing and lookalike domains\n- Urgency and fear-based social engineering\n- Malicious links using URL shorteners or redirectors\n- Malicious attachments (macros, executables, PDFs)\n\nIdentifying Phishing Emails\n- Check sender domain carefully\n- Hover over links before clicking\n- Look for grammar and spelling errors\n- Verify unexpected requests through separate channels\n- Check email headers for anomalies\n\nEmail Authentication Protocols\n- SPF: Authorizes sending mail servers\n- DKIM: Adds a cryptographic signature to emails\n- DMARC: Enforces SPF/DKIM alignment and sets policy for failures" });

  chapters.add(20, { id = 20; courseId = 2; title = "Chapter 10: VPN — Virtual Private Network"; order = 10; content = "What is a VPN?\nA VPN creates an encrypted tunnel over the internet, allowing secure communication between a user and a network as if they were directly connected.\n\nKey Functions of a VPN\n- Encrypts internet traffic\n- Masks real IP address\n- Enables secure remote access to corporate networks\n- Bypasses geographic restrictions\n\nTypes of VPN\n- Remote Access VPN: Individual users connecting to a corporate network\n- Site-to-Site VPN: Connecting two office networks over the internet\n- SSL/TLS VPN: Browser-based, no client software needed\n- IPSec VPN: Strong encryption for site-to-site and remote access\n- Split Tunneling: Routes only some traffic through the VPN\n\nVPN Protocols\n- OpenVPN: Open-source, highly secure\n- WireGuard: Modern, fast, lightweight\n- IKEv2/IPSec: Fast reconnection, mobile-friendly\n- L2TP/IPSec: Older standard, still widely used\n\nSecurity Benefits\n- Protects data on public Wi-Fi\n- Prevents ISP tracking\n- Secures remote workers accessing corporate resources\n- Reduces attack surface for remote access" });

  chapters.add(21, { id = 21; courseId = 2; title = "Chapter 11: Patch and Vulnerability Management"; order = 11; content = "Overview of Patch Management\nPatch management is the process of identifying, acquiring, testing, and applying updates (patches) to software and systems to fix security vulnerabilities and bugs.\n\nHow Patches Are Delivered\n- Vendor push updates (Windows Update, Apple Software Update)\n- WSUS (Windows Server Update Services) for enterprise environments\n- Third-party patch management tools (SCCM, Ivanti, ManageEngine)\n- Manual downloads from vendor security advisories\n\nPatch & Vulnerability Management Lifecycle\n1. Asset Inventory: Know all systems and software versions\n2. Vulnerability Identification: Scanning (Nessus, Qualys) and CVE monitoring\n3. Risk Assessment: CVSS scoring, business impact analysis\n4. Patch Prioritization: Critical patches first, especially for internet-facing systems\n5. Testing: Test patches in a staging environment before production\n6. Deployment: Roll out patches using change management procedures\n7. Verification: Confirm successful application\n8. Reporting & Compliance: Document patching status for audits\n\nKey Metrics\n- Mean Time to Patch (MTTP): Average time from vulnerability disclosure to patch\n- Patch Compliance Rate: Percentage of systems with current patches" });

  chapters.add(22, { id = 22; courseId = 2; title = "Chapter 12: Identity and Access Management (IAM)"; order = 12; content = "Overview of IAM\nIAM is a framework of policies and technologies ensuring that the right people have the right access to the right resources at the right time.\n\nWhy IAM Matters\n- Prevents unauthorized access to systems and data\n- Supports regulatory compliance (GDPR, HIPAA, SOX)\n- Reduces insider threat risk\n- Enables audit trails for access events\n\nKey IAM Components\n- Identity Provisioning: Creating and managing user accounts\n- Authentication: Verifying user identity (passwords, MFA, biometrics)\n- Authorization: Defining what a user can access (RBAC, ABAC)\n- Single Sign-On (SSO): One login for multiple systems\n- Privileged Access Management (PAM): Securing admin and privileged accounts\n- Directory Services: LDAP, Active Directory for centralized identity management\n- Identity Governance: Periodic access reviews and certifications\n\nRole of IAM in Compliance\n- Enforces least privilege principle\n- Provides evidence of access controls for audits\n- Automates user lifecycle (joiners, movers, leavers)\n- Segregation of Duties (SoD) to prevent fraud" });

  chapters.add(23, { id = 23; courseId = 2; title = "Chapter 13: Endpoint Security"; order = 13; content = "What is an Endpoint?\nWorkstations, servers, mobile devices, and IoT devices — any device connecting to the corporate network.\n\nCommon Endpoint Threats\n- Malware: Trojans, worms, ransomware, spyware\n- Phishing & Social Engineering\n- Exploits: Vulnerability exploitation, privilege escalation\n- Insider Threats: Malicious or negligent employees\n- Zero-Day Attacks: Exploiting unknown vulnerabilities\n\nEndpoint Protection Platforms (EPP)\n- Signature-based detection: Matches known malware signatures\n- Heuristic detection: Identifies suspicious behavior patterns\n- Behavior-based detection: Monitors runtime behavior for anomalies\n\nEndpoint Detection & Response (EDR)\nDifferences from EPP: EDR provides deeper visibility, threat hunting, and response capabilities.\n- EDR architecture: Agent-based telemetry collection\n- Process behavior tracking and memory analysis\n- Event correlation across endpoints\n- Threat hunting using EDR tools (CrowdStrike, SentinelOne, Microsoft Defender for Endpoint)\n\nEndpoint Hardening & Configuration\n- Remove unnecessary software and services\n- Enforce strong authentication (MFA)\n- Enable full disk encryption (BitLocker, FileVault)\n- Apply application whitelisting\n- Disable AutoRun and removable media\n- Regular vulnerability scanning and patching\n- Deploy host-based firewall and IDS" });

  ////////////
  // Progress
  ////////////
  let enrollments = Map.empty<Principal, Set.Set<Nat>>(); // user -> set of courseIds
  let completedChapters = Map.empty<Principal, Set.Set<Nat>>(); // user -> set of chapterIds

  var nextCourseId = 3;
  var nextChapterId = 24;

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

  ///////////////////////////
  // User Account Storage
  ///////////////////////////

  public type UserAccount = {
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

  let userAccounts = Map.empty<Text, UserAccount>();
  let emailIndex = Map.empty<Text, Text>();

  public shared func registerUser(
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

  public query func loginUser(username : Text, passwordHash : Text) : async ?UserAccount {
    switch (userAccounts.get(username)) {
      case (null) { null };
      case (?account) {
        if (account.isDisabled) { null }
        else if (account.passwordHash == passwordHash) { ?account }
        else { null };
      };
    };
  };

  public query func getMaskedEmailByUsername(username : Text) : async ?Text {
    switch (userAccounts.get(username)) {
      case (null) { null };
      case (?account) { ?account.email };
    };
  };

  public shared func saveAssessmentResult(username : Text, score : Nat, passed : Bool) : async Bool {
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

  public query func getAllRegisteredUsers() : async [UserAccount] {
    userAccounts.values().toArray();
  };

  public query func getUserByUsername(username : Text) : async ?UserAccount {
    userAccounts.get(username);
  };

  public shared func adminResetUserPassword(username : Text, newPasswordHash : Text) : async Bool {
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

  public shared func adminSetUserDisabled(username : Text, isDisabled : Bool) : async Bool {
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

  public shared func adminDeleteUser(username : Text) : async Bool {
    switch (userAccounts.get(username)) {
      case (null) { false };
      case (?account) {
        userAccounts.remove(username);
        emailIndex.remove(account.email);
        true;
      };
    };
  };

  public shared func adminAssignCourse(username : Text, enrolledCourse : ?Text) : async Bool {
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
};
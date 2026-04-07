export type Difficulty = "Easy" | "Medium" | "Hard";
export type Priority = "Must" | "High";
export type DSATier = 1 | 2 | 3;
export type SDType = "Concept" | "Design" | "Math";

export interface JavaTopic {
  id: string;
  section: string;
  topic: string;
  difficulty: Difficulty;
  priority: Priority;
  tags: string[];
}

export interface DSAPattern {
  id: string;
  tier: DSATier;
  pattern: string;
  dataStructure: string;
  tags: string[];
}

export interface SDConcept {
  id: string;
  number: number;
  concept: string;
  type: SDType;
  tags: string[];
}

export interface WeekPlan {
  week: number;
  month: number;
  monthLabel: string;
  java: string[];
  dsa: string[];
  systemDesign: string[];
  mockInterview: string;
}

// ─── Java Topics ────────────────────────────────────────────────────────────

export const javaTopics: JavaTopic[] = [
  // Fundamentals
  { id: "j01", section: "Fundamentals", topic: "OOP Principles (SOLID)", difficulty: "Easy", priority: "Must", tags: ["oop", "solid", "design"] },
  { id: "j02", section: "Fundamentals", topic: "Collections Framework", difficulty: "Medium", priority: "Must", tags: ["collections", "list", "map", "set"] },
  { id: "j03", section: "Fundamentals", topic: "Exception Handling", difficulty: "Easy", priority: "Must", tags: ["exceptions", "try-catch"] },
  { id: "j04", section: "Fundamentals", topic: "Generics & Type System", difficulty: "Medium", priority: "Must", tags: ["generics", "types", "wildcards"] },
  { id: "j05", section: "Fundamentals", topic: "String Manipulation", difficulty: "Easy", priority: "Must", tags: ["string", "stringbuilder"] },
  { id: "j06", section: "Fundamentals", topic: "Java Memory Model", difficulty: "Hard", priority: "Must", tags: ["memory", "heap", "stack", "jmm"] },
  { id: "j07", section: "Fundamentals", topic: "Serialization", difficulty: "Medium", priority: "High", tags: ["serialization", "io"] },
  { id: "j08", section: "Fundamentals", topic: "Reflection API", difficulty: "Hard", priority: "High", tags: ["reflection", "metadata", "annotations"] },

  // Java 8+
  { id: "j09", section: "Java 8+", topic: "Lambda Expressions", difficulty: "Easy", priority: "Must", tags: ["lambda", "functional", "java8"] },
  { id: "j10", section: "Java 8+", topic: "Stream API", difficulty: "Medium", priority: "Must", tags: ["streams", "functional", "pipeline"] },
  { id: "j11", section: "Java 8+", topic: "Optional", difficulty: "Easy", priority: "Must", tags: ["optional", "null-safety"] },
  { id: "j12", section: "Java 8+", topic: "Functional Interfaces", difficulty: "Medium", priority: "Must", tags: ["functional", "predicate", "function"] },
  { id: "j13", section: "Java 8+", topic: "Default & Static Methods in Interfaces", difficulty: "Medium", priority: "High", tags: ["interfaces", "default-methods"] },
  { id: "j14", section: "Java 8+", topic: "Date/Time API", difficulty: "Easy", priority: "High", tags: ["datetime", "localdatetime"] },
  { id: "j15", section: "Java 8+", topic: "CompletableFuture", difficulty: "Hard", priority: "Must", tags: ["async", "future", "concurrency"] },
  { id: "j16", section: "Java 8+", topic: "Records (Java 14+)", difficulty: "Easy", priority: "High", tags: ["records", "immutable", "java14"] },
  { id: "j17", section: "Java 8+", topic: "Sealed Classes (Java 17)", difficulty: "Medium", priority: "High", tags: ["sealed", "pattern-matching", "java17"] },
  { id: "j18", section: "Java 8+", topic: "Text Blocks (Java 13+)", difficulty: "Easy", priority: "High", tags: ["text-blocks", "string", "java13"] },

  // JVM Internals
  { id: "j19", section: "JVM Internals", topic: "ClassLoader Hierarchy", difficulty: "Hard", priority: "Must", tags: ["classloader", "jvm", "bootstrap"] },
  { id: "j20", section: "JVM Internals", topic: "Garbage Collection Algorithms", difficulty: "Hard", priority: "Must", tags: ["gc", "g1", "cms", "zgc"] },
  { id: "j21", section: "JVM Internals", topic: "JIT Compilation", difficulty: "Hard", priority: "High", tags: ["jit", "bytecode", "optimization"] },
  { id: "j22", section: "JVM Internals", topic: "Memory Areas (Heap, Stack, Metaspace)", difficulty: "Hard", priority: "Must", tags: ["heap", "stack", "metaspace"] },
  { id: "j23", section: "JVM Internals", topic: "Bytecode & javap", difficulty: "Medium", priority: "High", tags: ["bytecode", "javap", "decompile"] },

  // Concurrency
  { id: "j24", section: "Concurrency", topic: "Thread Lifecycle & States", difficulty: "Medium", priority: "Must", tags: ["threads", "lifecycle", "states"] },
  { id: "j25", section: "Concurrency", topic: "synchronized & volatile", difficulty: "Medium", priority: "Must", tags: ["synchronized", "volatile", "visibility"] },
  { id: "j26", section: "Concurrency", topic: "java.util.concurrent package", difficulty: "Hard", priority: "Must", tags: ["concurrent", "executor", "locks"] },
  { id: "j27", section: "Concurrency", topic: "Atomic Variables & CAS", difficulty: "Hard", priority: "Must", tags: ["atomic", "cas", "lock-free"] },
  { id: "j28", section: "Concurrency", topic: "ThreadLocal", difficulty: "Medium", priority: "High", tags: ["threadlocal", "isolation"] },
  { id: "j29", section: "Concurrency", topic: "Deadlock, Livelock, Starvation", difficulty: "Hard", priority: "Must", tags: ["deadlock", "livelock", "starvation"] },
  { id: "j30", section: "Concurrency", topic: "Fork/Join Framework", difficulty: "Hard", priority: "High", tags: ["fork-join", "parallel", "recursive"] },

  // Design Patterns
  { id: "j31", section: "Design Patterns", topic: "Singleton (thread-safe variants)", difficulty: "Medium", priority: "Must", tags: ["singleton", "creational"] },
  { id: "j32", section: "Design Patterns", topic: "Factory & Abstract Factory", difficulty: "Medium", priority: "Must", tags: ["factory", "creational"] },
  { id: "j33", section: "Design Patterns", topic: "Builder Pattern", difficulty: "Easy", priority: "Must", tags: ["builder", "creational", "fluent"] },
  { id: "j34", section: "Design Patterns", topic: "Observer Pattern", difficulty: "Medium", priority: "Must", tags: ["observer", "behavioral", "events"] },
  { id: "j35", section: "Design Patterns", topic: "Strategy & Template Method", difficulty: "Medium", priority: "Must", tags: ["strategy", "template", "behavioral"] },
  { id: "j36", section: "Design Patterns", topic: "Decorator & Proxy", difficulty: "Hard", priority: "High", tags: ["decorator", "proxy", "structural"] },

  // Advanced
  { id: "j37", section: "Advanced", topic: "Spring Core & DI", difficulty: "Medium", priority: "Must", tags: ["spring", "di", "ioc"] },
  { id: "j38", section: "Advanced", topic: "Spring Boot Auto-Configuration", difficulty: "Medium", priority: "Must", tags: ["spring-boot", "auto-config"] },
  { id: "j39", section: "Advanced", topic: "Spring Data JPA", difficulty: "Medium", priority: "Must", tags: ["jpa", "hibernate", "orm"] },
  { id: "j40", section: "Advanced", topic: "REST API Design & Spring MVC", difficulty: "Medium", priority: "Must", tags: ["rest", "spring-mvc", "api"] },
  { id: "j41", section: "Advanced", topic: "Transaction Management", difficulty: "Hard", priority: "Must", tags: ["transactions", "acid", "spring-tx"] },
  { id: "j42", section: "Advanced", topic: "Microservices Architecture", difficulty: "Hard", priority: "Must", tags: ["microservices", "architecture"] },
  { id: "j43", section: "Advanced", topic: "Reactive Programming (Project Reactor)", difficulty: "Hard", priority: "High", tags: ["reactive", "flux", "mono"] },
  { id: "j44", section: "Advanced", topic: "Messaging (Kafka / RabbitMQ)", difficulty: "Hard", priority: "High", tags: ["kafka", "messaging", "events"] },
  { id: "j45", section: "Advanced", topic: "Testing (JUnit 5, Mockito, TestContainers)", difficulty: "Medium", priority: "Must", tags: ["testing", "junit", "mockito"] },
  { id: "j46", section: "Advanced", topic: "Docker & Containerization", difficulty: "Medium", priority: "Must", tags: ["docker", "containers", "devops"] },
  { id: "j47", section: "Advanced", topic: "CI/CD Pipelines", difficulty: "Medium", priority: "High", tags: ["cicd", "github-actions", "devops"] },
  { id: "j48", section: "Advanced", topic: "Profiling & Performance Tuning", difficulty: "Hard", priority: "High", tags: ["profiling", "performance", "jvm"] },
];

export const javaSections = [...new Set(javaTopics.map((t) => t.section))];

// ─── DSA Patterns ────────────────────────────────────────────────────────────

export const dsaPatterns: DSAPattern[] = [
  // Tier 1 — Easy/Fundamentals
  { id: "d01", tier: 1, pattern: "Two Pointers", dataStructure: "Array / String", tags: ["array", "string", "in-place"] },
  { id: "d02", tier: 1, pattern: "Sliding Window", dataStructure: "Array / String", tags: ["array", "subarray", "window"] },
  { id: "d03", tier: 1, pattern: "Fast & Slow Pointers", dataStructure: "Linked List", tags: ["linked-list", "cycle", "floyd"] },
  { id: "d04", tier: 1, pattern: "Binary Search", dataStructure: "Sorted Array", tags: ["binary-search", "sorted", "divide-conquer"] },
  { id: "d05", tier: 1, pattern: "Hash Map / Hash Set", dataStructure: "Hash Table", tags: ["hashmap", "frequency", "lookup"] },
  { id: "d06", tier: 1, pattern: "Stack", dataStructure: "Stack", tags: ["stack", "monotonic", "parentheses"] },
  { id: "d07", tier: 1, pattern: "Queue / BFS Level Order", dataStructure: "Queue / Tree", tags: ["bfs", "queue", "tree", "level-order"] },
  { id: "d08", tier: 1, pattern: "Prefix Sum", dataStructure: "Array", tags: ["prefix-sum", "range-query"] },
  { id: "d09", tier: 1, pattern: "Sorting Algorithms", dataStructure: "Array", tags: ["sort", "merge-sort", "quicksort"] },
  { id: "d10", tier: 1, pattern: "Recursion Basics", dataStructure: "Stack (implicit)", tags: ["recursion", "base-case"] },
  { id: "d11", tier: 1, pattern: "String Manipulation", dataStructure: "String", tags: ["string", "anagram", "palindrome"] },
  { id: "d12", tier: 1, pattern: "Matrix Traversal", dataStructure: "2D Array", tags: ["matrix", "grid", "2d-array"] },

  // Tier 2 — Medium/Intermediate
  { id: "d13", tier: 2, pattern: "DFS on Trees", dataStructure: "Binary Tree", tags: ["dfs", "tree", "recursion"] },
  { id: "d14", tier: 2, pattern: "DFS on Graphs", dataStructure: "Graph (Adj. List)", tags: ["dfs", "graph", "connected"] },
  { id: "d15", tier: 2, pattern: "BFS on Graphs", dataStructure: "Graph (Adj. List)", tags: ["bfs", "graph", "shortest-path"] },
  { id: "d16", tier: 2, pattern: "Dynamic Programming — 1D", dataStructure: "Array / DP Table", tags: ["dp", "memoization", "tabulation"] },
  { id: "d17", tier: 2, pattern: "Dynamic Programming — 2D", dataStructure: "Matrix / DP Table", tags: ["dp", "grid", "matrix-dp"] },
  { id: "d18", tier: 2, pattern: "Backtracking", dataStructure: "Tree (implicit)", tags: ["backtracking", "permutations", "combinations"] },
  { id: "d19", tier: 2, pattern: "Heap / Priority Queue", dataStructure: "Heap (Min/Max)", tags: ["heap", "priority-queue", "top-k"] },
  { id: "d20", tier: 2, pattern: "Merge Intervals", dataStructure: "Array of Intervals", tags: ["intervals", "overlap", "sort"] },
  { id: "d21", tier: 2, pattern: "Cyclic Sort / Index Tricks", dataStructure: "Array", tags: ["cyclic-sort", "missing", "duplicate"] },
  { id: "d22", tier: 2, pattern: "Top-K / K-th Largest", dataStructure: "Heap / QuickSelect", tags: ["top-k", "heap", "quickselect"] },
  { id: "d23", tier: 2, pattern: "Binary Search on Answer", dataStructure: "Sorted Space", tags: ["binary-search", "monotonic", "answer-space"] },
  { id: "d24", tier: 2, pattern: "Linked List Reversal", dataStructure: "Linked List", tags: ["linked-list", "reverse", "in-place"] },

  // Tier 3 — Hard/Advanced
  { id: "d25", tier: 3, pattern: "Trie (Prefix Tree)", dataStructure: "Trie", tags: ["trie", "prefix", "autocomplete"] },
  { id: "d26", tier: 3, pattern: "Union-Find (Disjoint Set)", dataStructure: "Union-Find", tags: ["union-find", "dsu", "connectivity"] },
  { id: "d27", tier: 3, pattern: "Topological Sort", dataStructure: "DAG", tags: ["topo-sort", "dag", "dependencies"] },
  { id: "d28", tier: 3, pattern: "Dijkstra's Algorithm", dataStructure: "Weighted Graph", tags: ["dijkstra", "shortest-path", "weighted"] },
  { id: "d29", tier: 3, pattern: "Segment Tree / BIT", dataStructure: "Tree / BIT", tags: ["segment-tree", "bit", "range-update"] },
  { id: "d30", tier: 3, pattern: "Monotonic Stack / Queue", dataStructure: "Stack / Deque", tags: ["monotonic", "next-greater", "sliding-max"] },
  { id: "d31", tier: 3, pattern: "Bit Manipulation", dataStructure: "Integer Bits", tags: ["bits", "xor", "mask"] },
  { id: "d32", tier: 3, pattern: "Greedy Algorithms", dataStructure: "Array / Priority Queue", tags: ["greedy", "optimal", "interval"] },
  { id: "d33", tier: 3, pattern: "Advanced DP (Bitmask, LCS, LIS)", dataStructure: "DP Table", tags: ["dp", "bitmask", "lcs", "lis"] },
  { id: "d34", tier: 3, pattern: "Graph — Minimum Spanning Tree", dataStructure: "Graph", tags: ["mst", "kruskal", "prim"] },
];

// ─── System Design Concepts ──────────────────────────────────────────────────

export const sdConcepts: SDConcept[] = [
  // Core Concepts
  { id: "s01", number: 1, concept: "Scalability — Horizontal vs Vertical", type: "Concept", tags: ["scalability", "horizontal", "vertical"] },
  { id: "s02", number: 2, concept: "Load Balancing (L4/L7, Round-Robin, Consistent Hashing)", type: "Concept", tags: ["load-balancer", "consistent-hashing"] },
  { id: "s03", number: 3, concept: "Caching (Redis, Memcached, CDN, Cache Eviction)", type: "Concept", tags: ["cache", "redis", "cdn", "lru"] },
  { id: "s04", number: 4, concept: "Database Sharding & Partitioning", type: "Concept", tags: ["sharding", "partitioning", "database"] },
  { id: "s05", number: 5, concept: "SQL vs NoSQL — Trade-offs & Use Cases", type: "Concept", tags: ["sql", "nosql", "trade-offs"] },
  { id: "s06", number: 6, concept: "Replication — Master-Slave, Multi-Master", type: "Concept", tags: ["replication", "master-slave", "ha"] },
  { id: "s07", number: 7, concept: "CAP Theorem", type: "Math", tags: ["cap", "consistency", "availability", "partition"] },
  { id: "s08", number: 8, concept: "Consistency Patterns (Eventual, Strong, Causal)", type: "Concept", tags: ["consistency", "eventual", "strong"] },
  { id: "s09", number: 9, concept: "API Design — REST, GraphQL, gRPC", type: "Concept", tags: ["api", "rest", "graphql", "grpc"] },
  { id: "s10", number: 10, concept: "Message Queues & Event Streaming (Kafka, RabbitMQ)", type: "Concept", tags: ["kafka", "queue", "streaming"] },
  { id: "s11", number: 11, concept: "Microservices vs Monolith", type: "Concept", tags: ["microservices", "monolith", "architecture"] },
  { id: "s12", number: 12, concept: "Service Discovery & API Gateway", type: "Concept", tags: ["service-discovery", "api-gateway", "consul"] },
  { id: "s13", number: 13, concept: "Distributed Transactions (2PC, Saga Pattern)", type: "Concept", tags: ["distributed-tx", "saga", "2pc"] },
  { id: "s14", number: 14, concept: "Indexing Strategies (B-Tree, LSM-Tree, Inverted Index)", type: "Concept", tags: ["indexing", "btree", "lsm"] },
  { id: "s15", number: 15, concept: "Rate Limiting & Throttling", type: "Concept", tags: ["rate-limit", "throttle", "token-bucket"] },
  { id: "s16", number: 16, concept: "Circuit Breaker & Bulkhead Patterns", type: "Concept", tags: ["circuit-breaker", "resilience", "bulkhead"] },
  { id: "s17", number: 17, concept: "Content Delivery Network (CDN)", type: "Concept", tags: ["cdn", "edge", "caching"] },
  { id: "s18", number: 18, concept: "Search Systems (Elasticsearch, Inverted Index)", type: "Concept", tags: ["search", "elasticsearch", "full-text"] },

  // Design Problems
  { id: "s19", number: 19, concept: "Design URL Shortener (TinyURL)", type: "Design", tags: ["url-shortener", "hashing", "redirect"] },
  { id: "s20", number: 20, concept: "Design Twitter Feed / News Feed", type: "Design", tags: ["news-feed", "fanout", "timeline"] },
  { id: "s21", number: 21, concept: "Design Rate Limiter", type: "Design", tags: ["rate-limiter", "sliding-window", "token-bucket"] },
  { id: "s22", number: 22, concept: "Design Distributed Cache", type: "Design", tags: ["cache", "distributed", "consistent-hashing"] },
  { id: "s23", number: 23, concept: "Design Notification System", type: "Design", tags: ["notifications", "push", "websockets"] },
  { id: "s24", number: 24, concept: "Design Key-Value Store", type: "Design", tags: ["kv-store", "dynamo", "storage"] },
  { id: "s25", number: 25, concept: "Design Search Autocomplete", type: "Design", tags: ["autocomplete", "trie", "typeahead"] },
  { id: "s26", number: 26, concept: "Design Web Crawler", type: "Design", tags: ["crawler", "bfs", "distributed"] },
  { id: "s27", number: 27, concept: "Design YouTube / Video Streaming", type: "Design", tags: ["video", "cdn", "streaming", "transcoding"] },
  { id: "s28", number: 28, concept: "Design Uber / Ride Matching", type: "Design", tags: ["geospatial", "matching", "realtime"] },
  { id: "s29", number: 29, concept: "Design Chat System (WhatsApp)", type: "Design", tags: ["chat", "websockets", "presence"] },
  { id: "s30", number: 30, concept: "Design Dropbox / File Storage", type: "Design", tags: ["file-storage", "s3", "sync", "chunking"] },
  { id: "s31", number: 31, concept: "Design Google Docs (Collaborative Editing)", type: "Design", tags: ["collaborative", "crdt", "ot", "realtime"] },
  { id: "s32", number: 32, concept: "Design Stock Exchange / Trading System", type: "Design", tags: ["trading", "orderbook", "low-latency"] },
  { id: "s33", number: 33, concept: "Design Payment System", type: "Design", tags: ["payments", "idempotency", "transactions"] },
  { id: "s34", number: 34, concept: "Design E-Commerce Platform", type: "Design", tags: ["ecommerce", "inventory", "catalog"] },
  { id: "s35", number: 35, concept: "Design Ad Click Aggregator", type: "Design", tags: ["analytics", "aggregation", "lambda-arch"] },

  // Math / Principles
  { id: "s36", number: 36, concept: "Back-of-the-Envelope Calculations", type: "Math", tags: ["estimation", "capacity", "napkin-math"] },
  { id: "s37", number: 37, concept: "PACELC Theorem", type: "Math", tags: ["pacelc", "latency", "consistency"] },
  { id: "s38", number: 38, concept: "ACID vs BASE Properties", type: "Math", tags: ["acid", "base", "transactions"] },
  { id: "s39", number: 39, concept: "Bloom Filters & Probabilistic Structures", type: "Math", tags: ["bloom-filter", "probabilistic", "space"] },
  { id: "s40", number: 40, concept: "Consistent Hashing Deep Dive", type: "Math", tags: ["consistent-hashing", "virtual-nodes", "chord"] },
];

// ─── 12-Week Plan ─────────────────────────────────────────────────────────────

export const weeklyPlan: WeekPlan[] = [
  // Month 1 — Foundations
  {
    week: 1, month: 1, monthLabel: "Foundations",
    java: ["OOP Principles (SOLID)", "Collections Framework", "Exception Handling", "Generics & Type System"],
    dsa: ["Two Pointers", "Sliding Window", "Hash Map / Hash Set", "Binary Search"],
    systemDesign: ["Scalability — Horizontal vs Vertical", "Load Balancing", "Back-of-the-Envelope Calculations"],
    mockInterview: "2× Easy LeetCode + 1× OOP system design question",
  },
  {
    week: 2, month: 1, monthLabel: "Foundations",
    java: ["Lambda Expressions", "Stream API", "Optional", "Functional Interfaces"],
    dsa: ["Stack", "Queue / BFS Level Order", "Prefix Sum", "Fast & Slow Pointers"],
    systemDesign: ["Caching (Redis, CDN, LRU)", "SQL vs NoSQL Trade-offs"],
    mockInterview: "2× Easy/Medium LeetCode + explain Stream API internals",
  },
  {
    week: 3, month: 1, monthLabel: "Foundations",
    java: ["Thread Lifecycle & States", "synchronized & volatile", "Java Memory Model", "Memory Areas (Heap, Stack, Metaspace)"],
    dsa: ["Sorting Algorithms", "Recursion Basics", "String Manipulation", "Matrix Traversal"],
    systemDesign: ["Database Sharding & Partitioning", "Replication — Master-Slave"],
    mockInterview: "1× Threading interview question + 2× Medium LeetCode",
  },
  {
    week: 4, month: 1, monthLabel: "Foundations",
    java: ["Singleton (thread-safe variants)", "Factory & Abstract Factory", "Builder Pattern", "Observer Pattern"],
    dsa: ["DFS on Trees", "Binary Search on Answer", "Merge Intervals"],
    systemDesign: ["CAP Theorem", "ACID vs BASE Properties", "Design URL Shortener (TinyURL)"],
    mockInterview: "1× Design Patterns interview + 1× System Design (URL Shortener)",
  },

  // Month 2 — Intermediate
  {
    week: 5, month: 2, monthLabel: "Intermediate",
    java: ["java.util.concurrent package", "Atomic Variables & CAS", "CompletableFuture", "Deadlock, Livelock, Starvation"],
    dsa: ["DFS on Graphs", "BFS on Graphs", "Dynamic Programming — 1D"],
    systemDesign: ["CAP Theorem deep-dive", "Consistency Patterns", "Design Rate Limiter"],
    mockInterview: "Concurrency scenario question + 2× Medium Graph LeetCode",
  },
  {
    week: 6, month: 2, monthLabel: "Intermediate",
    java: ["ClassLoader Hierarchy", "Garbage Collection Algorithms", "JIT Compilation"],
    dsa: ["Dynamic Programming — 2D", "Backtracking", "Top-K / K-th Largest"],
    systemDesign: ["API Design — REST, GraphQL, gRPC", "Rate Limiting & Throttling", "Design Twitter Feed"],
    mockInterview: "JVM deep-dive question + 1× System Design (Twitter Feed)",
  },
  {
    week: 7, month: 2, monthLabel: "Intermediate",
    java: ["Spring Core & DI", "Spring Boot Auto-Configuration", "REST API Design & Spring MVC"],
    dsa: ["Heap / Priority Queue", "Cyclic Sort / Index Tricks", "Linked List Reversal"],
    systemDesign: ["Message Queues & Event Streaming", "Service Discovery & API Gateway", "Design Notification System"],
    mockInterview: "Spring Boot scenario + 2× Medium LeetCode + mini system design",
  },
  {
    week: 8, month: 2, monthLabel: "Intermediate",
    java: ["Spring Data JPA", "Transaction Management", "Testing (JUnit 5, Mockito, TestContainers)"],
    dsa: ["Trie (Prefix Tree)", "Union-Find (Disjoint Set)", "Topological Sort"],
    systemDesign: ["Microservices vs Monolith", "Distributed Transactions", "Design Distributed Cache"],
    mockInterview: "Full mock interview: 1× coding + 1× system design (Distributed Cache)",
  },

  // Month 3 — Advanced
  {
    week: 9, month: 3, monthLabel: "Advanced",
    java: ["Microservices Architecture", "Messaging (Kafka / RabbitMQ)", "Reactive Programming (Project Reactor)"],
    dsa: ["Dijkstra's Algorithm", "Monotonic Stack / Queue", "Bit Manipulation"],
    systemDesign: ["Indexing Strategies (B-Tree, LSM-Tree)", "Search Systems (Elasticsearch)", "Design Key-Value Store"],
    mockInterview: "Kafka scenario + 2× Hard LeetCode + System Design (Key-Value Store)",
  },
  {
    week: 10, month: 3, monthLabel: "Advanced",
    java: ["Strategy & Template Method", "Decorator & Proxy", "Reflection API"],
    dsa: ["Greedy Algorithms", "Advanced DP (Bitmask, LCS, LIS)", "Segment Tree / BIT"],
    systemDesign: ["Content Delivery Network", "Circuit Breaker & Bulkhead", "Design YouTube / Video Streaming"],
    mockInterview: "Advanced design pattern question + 1× Hard DP + System Design (YouTube)",
  },
  {
    week: 11, month: 3, monthLabel: "Advanced",
    java: ["Docker & Containerization", "CI/CD Pipelines", "Profiling & Performance Tuning"],
    dsa: ["Graph — Minimum Spanning Tree", "Bloom Filters", "Review Weak Areas"],
    systemDesign: ["Consistent Hashing Deep Dive", "Design Uber / Ride Matching", "Design Chat System (WhatsApp)"],
    mockInterview: "DevOps scenario + 2× Hard LeetCode + System Design (Uber or WhatsApp)",
  },
  {
    week: 12, month: 3, monthLabel: "Advanced",
    java: ["Full Java review — focus on gaps", "Spring ecosystem consolidation"],
    dsa: ["Mock contest: 3 problems in 90 min", "Review all patterns"],
    systemDesign: ["Design Payment System", "Design Google Docs (Collaborative Editing)", "Full SD mock"],
    mockInterview: "2× Full mock interviews (FAANG-style): 1 coding round + 1 system design",
  },
];

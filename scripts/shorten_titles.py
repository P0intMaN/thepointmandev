import pathlib, re

titles = {
    "behavioral-patterns":             "Behavioural Patterns",
    "clean-architecture":              "Clean Architecture",
    "collections-lists":               "Lists Deep Dive",
    "collections-maps":                "Maps Deep Dive",
    "collections-sets-queues":         "Sets & Queues",
    "creational-patterns":             "Creational Patterns",
    "database-transactions":           "Database Transactions",
    "garbage-collection":              "Garbage Collection",
    "java-atomic-lockfree":            "Atomic & Lock-Free",
    "java-bytecode":                   "Java Bytecode",
    "java-collectors":                 "Java Collectors",
    "java-completable-future":         "CompletableFuture",
    "java-concurrent-collections":     "Concurrent Collections",
    "java-exceptions-in-depth":        "Java Exceptions",
    "java-executor-framework":         "Executor Framework",
    "java-explicit-locks":             "Explicit Locks",
    "java-fork-join":                  "Fork/Join & Work-Stealing",
    "java-generics":                   "Java Generics",
    "java-io-streams":                 "Java I/O Streams",
    "java-lambdas-functional":         "Lambdas & Functional Java",
    "java-memory-model-concurrency":   "Java Memory Model",
    "java-nio":                        "Java NIO",
    "java-nio2":                       "Java NIO.2",
    "java-oop-internals":              "OOP Internals",
    "java-reflection-proxies":         "Reflection & Dynamic Proxies",
    "java-serialization":              "Java Serialisation",
    "java-streams-internals":          "Java Streams",
    "java-strings-in-depth":           "Java Strings",
    "java-synchronization-primitives": "Synchronization Primitives",
    "java-synchronizers":              "Java Synchronizers",
    "java-testing":                    "Testing Mastery",
    "java-threads-fundamentals":       "Java Threads",
    "java-type-system":                "Java Type System",
    "java-virtual-threads":            "Virtual Threads",
    "jdbc-and-pooling":                "JDBC & Connection Pooling",
    "jit-compiler":                    "The JIT Compiler",
    "jpa-hibernate":                   "JPA & Hibernate",
    "jvm-classloading":                "ClassLoader Pipeline",
    "jvm-memory-regions":              "JVM Memory Regions",
    "modern-java-features":            "Modern Java",
    "reactive-java":                   "Reactive Java",
    "solid-principles":                "SOLID Principles",
    "spring-data-jpa":                 "Spring Data JPA",
    "structural-patterns":             "Structural Patterns",
}

base = pathlib.Path("C:/Dev/thepointmandev/content/courses")
for slug, new_title in titles.items():
    meta = base / slug / "_meta.mdx"
    if not meta.exists():
        print(f"MISSING: {slug}")
        continue
    text = meta.read_text(encoding="utf-8")
    updated = re.sub(r'^title:.*$', f'title: "{new_title}"', text, flags=re.MULTILINE)
    meta.write_text(updated, encoding="utf-8")
    print(f"OK  {slug}")

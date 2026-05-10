export const MODULES = [
  {
    id: "m1",
    title: "Binary Basics",
    emoji: "💡",
    color: "#00ff88",
    tagline: "Where all digital data begins",
    lessons: [
      {
        id: "l1-1", title: "What is Binary?", duration: "5 min", xp: 20,
        sections: [
          {
            heading: "The simplest possible language",
            body: `Imagine a light switch. It is either ON or OFF — there is no in-between. Computers work the same way. Inside every computer are billions of tiny switches called transistors. Each one is either on (1) or off (0).

This two-symbol system is called binary, or base-2. Every single thing your computer does — every photo, message, game, and video — is ultimately stored and processed as a long chain of 1s and 0s.`,
          },
          {
            heading: "Counting in binary",
            body: `In everyday life we use base-10 (decimal): digits 0 through 9. When we run out of digits we add a new column (9 → 10).

Binary works the same way but runs out after just two digits:

  Decimal:  0   1   2    3   4    5    6    7
  Binary:   0   1  10   11 100  101  110  111

Each new column in binary is worth twice the previous one.`,
            visual: "binary-count",
          },
          {
            heading: "Why not just use decimal?",
            body: `Electronic circuits are far more reliable when they only need to distinguish between two voltage levels — high (~5V) and low (~0V). Trying to reliably distinguish ten separate levels would be much harder to engineer and far more prone to errors.

Binary keeps computers simple, fast, and accurate.`,
          },
        ],
        quiz: [
          { q: "A single binary digit (0 or 1) is called a:", opts: ["Byte","Bit","Nybble","Pixel"], a: "Bit", explain: "A bit (binary digit) is the smallest unit of data — a single 0 or 1." },
          { q: "What does binary '10' equal in decimal?", opts: ["10","2","1","8"], a: "2", explain: "Binary 10 = 1×2 + 0×1 = 2. The column value is 2 instead of 10." },
          { q: "Why do computers use binary instead of decimal?", opts: ["Binary was invented first","Binary is easier for humans","Electronic circuits reliably distinguish two voltage levels","Binary uses less electricity"], a: "Electronic circuits reliably distinguish two voltage levels", explain: "Transistors act as on/off switches. Two states are easy to distinguish reliably in hardware." },
        ],
      },
      {
        id: "l1-2", title: "Place Values & Powers of 2", duration: "7 min", xp: 25,
        sections: [
          {
            heading: "Each column is worth double",
            body: `In decimal, columns from right to left are worth: 1, 10, 100, 1000…
In binary they are: 1, 2, 4, 8, 16, 32, 64, 128…

These are the powers of 2 (2⁰=1, 2¹=2, 2²=4, 2³=8…).

To read a binary number, look at each column with a 1 and add those values.`,
            visual: "bit-weights",
          },
          {
            heading: "Example: reading 01101010",
            body: `Column values:  128  64  32  16   8   4   2   1
Binary digits:    0   1   1   0   1   0   1   0

Columns with a 1: 64 + 32 + 8 + 2 = 106

So 01101010 in binary = 106 in decimal.`,
          },
          {
            heading: "Powers of 2 worth memorising",
            body: `2⁰  =    1
2¹  =    2
2²  =    4
2³  =    8
2⁴  =   16
2⁵  =   32
2⁶  =   64
2⁷  =  128  ← MSB of an 8-bit byte
2⁸  =  256  ← total values in one byte
2¹⁰ = 1024  ← approx 1 kilobyte`,
          },
        ],
        quiz: [
          { q: "What is binary 00001000 in decimal?", opts: ["4","8","16","32"], a: "8", explain: "Position 3 from right has value 2³ = 8." },
          { q: "Which bit has the highest value in an 8-bit byte?", opts: ["Rightmost","Middle","Leftmost","They are equal"], a: "Leftmost", explain: "Leftmost = MSB (Most Significant Bit). In 8 bits it has value 2⁷ = 128." },
          { q: "What is binary 11111111 in decimal?", opts: ["127","255","256","128"], a: "255", explain: "128+64+32+16+8+4+2+1 = 255 — the maximum value of one unsigned byte." },
        ],
      },
      {
        id: "l1-3", title: "Bits, Bytes & Data Sizes", duration: "6 min", xp: 20,
        sections: [
          {
            heading: "Grouping bits into bytes",
            body: `One bit can only store two values (0 or 1). To store richer data we group bits:

  4 bits = 1 nybble
  8 bits = 1 byte  ← the standard unit

One byte can hold 2⁸ = 256 different values (0 to 255). That is enough to store one ASCII character, one pixel brightness channel, or a small number.`,
            visual: "byte-diagram",
          },
          {
            heading: "Data size units",
            body: `1 Byte     =  8 bits
1 Kilobyte =  1,024 bytes   (2¹⁰)
1 Megabyte =  1,024 KB      (2²⁰)
1 Gigabyte =  1,024 MB      (2³⁰)
1 Terabyte =  1,024 GB      (2⁴⁰)

Tip: storage manufacturers often use 1 KB = 1,000 bytes so your "1 TB" drive shows slightly less in your OS.`,
          },
          {
            heading: "Real sizes to build intuition",
            body: `One character of text:  1 byte
"Hello World":         11 bytes
A webpage:             ~50 KB
A high-res photo:      ~3–5 MB
A 3-min MP3:           ~3–4 MB
1-hour 1080p video:    ~2–4 GB
A modern AAA game:     ~50–100 GB`,
          },
        ],
        quiz: [
          { q: "How many bits are in one byte?", opts: ["4","8","16","32"], a: "8", explain: "By convention a byte is 8 bits, giving 256 possible values (2⁸)." },
          { q: "How many unique values can one byte represent?", opts: ["128","255","256","512"], a: "256", explain: "2⁸ = 256 values, ranging from 0 to 255 inclusive." },
          { q: "What does KB stand for?", opts: ["Kilobit","Kilobyte","Kilobaud","Kernelbit"], a: "Kilobyte", explain: "KB = Kilobyte = 1,024 bytes. Kb (lowercase b) means kilobit." },
        ],
      },
    ],
  },
  {
    id: "m2",
    title: "Text & Encoding",
    emoji: "🔤",
    color: "#ffb800",
    tagline: "How computers store letters and characters",
    lessons: [
      {
        id: "l2-1", title: "ASCII — The Character Code", duration: "8 min", xp: 30,
        sections: [
          {
            heading: "The problem: which number means 'A'?",
            body: `In 1963 engineers from different companies needed to agree: if I send you the number 65 over a cable, does that mean the letter 'A'? The American Standard Code for Information Interchange (ASCII) settled this by publishing a table mapping 128 characters to numbers 0–127.

Every computer since then has honoured this agreement.`,
          },
          {
            heading: "The key values to know",
            body: `Uppercase:  'A' = 65 … 'Z' = 90
Lowercase:  'a' = 97 … 'z' = 122
Digits:     '0' = 48 … '9' = 57
Space = 32, Newline = 10, Tab = 9

Pattern: 'a' = 'A' + 32. Flipping bit 5 toggles case!
Also: digit '5' = 53, but the number 5 = 5 — characters and numbers differ.`,
            visual: "ascii-grid",
          },
          {
            heading: "Control characters (0–31)",
            body: `The first 32 codes are invisible control characters from the teletype era:

  0  = Null (NUL — string terminator in C)
  9  = Tab (\\t)
 10  = Line Feed / newline (\\n)
 13  = Carriage Return (\\r)
 27  = Escape

You will still see these in code as \\n, \\t, \\r every day.`,
          },
        ],
        quiz: [
          { q: "What decimal ASCII value represents 'A'?", opts: ["64","65","97","41"], a: "65", explain: "'A' = 65. Uppercase letters run A(65) through Z(90)." },
          { q: "What is the difference between 'A'(65) and 'a'(97)?", opts: ["16","26","32","64"], a: "32", explain: "'a'(97) - 'A'(65) = 32. Toggling bit 5 flips between upper and lower case." },
          { q: "The digit character '7' in ASCII equals which number?", opts: ["7","55","57","48"], a: "55", explain: "ASCII '0'=48, so '7' = 48+7 = 55. Different from the number 7!" },
        ],
      },
      {
        id: "l2-2", title: "Hexadecimal — Base 16", duration: "8 min", xp: 35,
        sections: [
          {
            heading: "Why hex exists",
            body: `Binary is precise but verbose. One byte takes 8 characters: 01000001.
Hexadecimal (base-16) is compact shorthand: one byte = exactly 2 hex digits: 41.

That is why programmers, debuggers, and network tools all use hex — it is a direct compressed view of raw binary data.`,
          },
          {
            heading: "The 16 hex digits",
            body: `Hex uses: 0 1 2 3 4 5 6 7 8 9 A B C D E F

Where: A=10  B=11  C=12  D=13  E=14  F=15

Counting: 0 1 2 … 9 A B C D E F 10 11 12 …

The '0x' prefix signals hex: 0xFF = 255, 0x1F = 31.`,
          },
          {
            heading: "Hex ↔ Binary (4 bits = 1 hex digit)",
            body: `Because 16 = 2⁴, one hex digit maps to exactly 4 binary bits:

  0=0000  4=0100  8=1000  C=1100
  1=0001  5=0101  9=1001  D=1101
  2=0010  6=0110  A=1010  E=1110
  3=0011  7=0111  B=1011  F=1111

Example: 0x4A = 0100 1010 = 74 decimal
CSS colour #FF5733 = Red 255, Green 87, Blue 51`,
            visual: "hex-map",
          },
        ],
        quiz: [
          { q: "What is 0xFF in decimal?", opts: ["127","254","255","256"], a: "255", explain: "0xFF = 15×16 + 15 = 255. FF is the maximum value of one byte." },
          { q: "How many binary bits does one hex digit represent?", opts: ["2","4","6","8"], a: "4", explain: "16 = 2⁴, so one hex digit holds exactly 4 bits (one nybble)." },
          { q: "What does the '0x' prefix mean?", opts: ["Negative number","Hexadecimal","Binary","Version 0"], a: "Hexadecimal", explain: "'0x' is the standard programming prefix meaning 'this is base-16'." },
        ],
      },
      {
        id: "l2-3", title: "Unicode & UTF-8", duration: "7 min", xp: 35,
        sections: [
          {
            heading: "ASCII only covers English",
            body: `ASCII defines 128 characters — fine for English, but what about Arabic, Chinese, Hindi, or emoji?

Unicode assigns a unique code point to over 140,000 characters:
  U+0041 = 'A'     U+00E9 = 'é'
  U+4E2D = '中'    U+1F600 = 😀`,
          },
          {
            heading: "UTF-8: how Unicode is stored",
            body: `UTF-8 stores Unicode using 1–4 bytes per character:

  1 byte:  ASCII range (U+0000–007F) — same as ASCII!
  2 bytes: Latin, Greek, Arabic, Hebrew
  3 bytes: Most CJK (Chinese, Japanese, Korean)
  4 bytes: Emoji and rare scripts

'H' = 1 byte  ·  'é' = 2 bytes
'中' = 3 bytes  ·  '😀' = 4 bytes`,
          },
          {
            heading: "Why UTF-8 won",
            body: `UTF-8 is used by 98% of websites because:

1. Backwards-compatible — any ASCII file is valid UTF-8
2. Efficient — English text stays 1 byte per character
3. No byte-order problems (unlike UTF-16)
4. Self-synchronising — you can always tell where a character starts

Always declare charset=UTF-8 in your HTML meta tag.`,
          },
        ],
        quiz: [
          { q: "How many bytes does UTF-8 use for a standard ASCII character?", opts: ["1","2","3","4"], a: "1", explain: "UTF-8 is backwards-compatible with ASCII. U+0000–007F use exactly 1 byte." },
          { q: "What does 'U+1F600' refer to?", opts: ["A USB version","A Unicode code point","A UTF-8 encoding","A Unix timestamp"], a: "A Unicode code point", explain: "U+XXXX is the standard way to write a Unicode code point." },
          { q: "Why is UTF-8 preferred over UTF-32 for the web?", opts: ["UTF-32 is not real","UTF-8 is ASCII-compatible and space-efficient","UTF-8 supports more characters","UTF-32 is less secure"], a: "UTF-8 is ASCII-compatible and space-efficient", explain: "UTF-32 uses 4 bytes per character always. UTF-8 uses 1 byte for ASCII — huge savings." },
        ],
      },
    ],
  },
  {
    id: "m3",
    title: "Networking & IP",
    emoji: "🌐",
    color: "#00d4ff",
    tagline: "How binary powers the internet",
    lessons: [
      {
        id: "l3-1", title: "How Networks Work", duration: "7 min", xp: 30,
        sections: [
          {
            heading: "What is a network?",
            body: `A network is any group of devices that can communicate with each other. Your home Wi-Fi connects your phone, laptop, and TV into a local network. The internet is millions of these networks connected together.

Data travels across networks in small chunks called packets. Each packet carries a destination address, just like an envelope with a postal address.`,
          },
          {
            heading: "The OSI model — 7 layers of networking",
            body: `Networks are designed in layers, each handling a specific job:

  7. Application — what the user sees (HTTP, DNS, email)
  6. Presentation — data formatting, encryption
  5. Session — managing connections
  4. Transport — reliable delivery (TCP / UDP)
  3. Network — routing between networks (IP)
  2. Data Link — device-to-device on same network (MAC)
  1. Physical — actual cables, signals, radio waves

Focus on layers 3 (IP) and 4 (TCP/UDP) — they power the internet.`,
          },
          {
            heading: "TCP vs UDP",
            body: `TCP (Transmission Control Protocol):
· Guarantees delivery — lost packets are re-sent
· Data arrives in order
· Slower (has overhead for reliability)
· Used by: web browsing, email, file transfers

UDP (User Datagram Protocol):
· Fire and forget — no guarantee of delivery
· Faster, lower latency
· Used by: video calls, gaming, live streaming, DNS

Think: TCP = registered mail. UDP = dropping a leaflet through the door.`,
          },
        ],
        quiz: [
          { q: "Which OSI layer handles routing between networks?", opts: ["Layer 1 (Physical)","Layer 2 (Data Link)","Layer 3 (Network)","Layer 4 (Transport)"], a: "Layer 3 (Network)", explain: "Layer 3 (Network) handles IP addressing and routing between different networks." },
          { q: "Which protocol guarantees delivery of packets?", opts: ["UDP","IP","TCP","DNS"], a: "TCP", explain: "TCP (Transmission Control Protocol) guarantees delivery and correct ordering of packets." },
          { q: "What is a packet?", opts: ["A network cable","A small chunk of data with a destination address","A type of router","A wireless signal"], a: "A small chunk of data with a destination address", explain: "Data is broken into packets for transmission. Each carries source, destination, and payload." },
        ],
      },
      {
        id: "l3-2", title: "IP Addresses in Binary", duration: "8 min", xp: 35,
        sections: [
          {
            heading: "What is an IP address?",
            body: `Every device on a network has an IP address — a unique number that works like a postal address. IPv4 addresses are written in dotted decimal for humans:

  192.168.1.1

But underneath they are just 32-bit binary numbers. The dots split the address into four groups of 8 bits each (called octets).`,
          },
          {
            heading: "Reading an IP in binary",
            body: `192.168.1.1 in binary:

  192 = 11000000
  168 = 10101000
    1 = 00000001
    1 = 00000001

Full: 11000000.10101000.00000001.00000001

32 bits total = 2³² = 4.3 billion possible addresses.`,
            visual: "ip-builder",
          },
          {
            heading: "Special addresses",
            body: `127.0.0.1     — Loopback (localhost — always your own machine)
192.168.x.x  — Private (home routers)
10.x.x.x     — Private (large enterprise)
172.16–31.x  — Private (medium networks)

These private ranges never appear on the public internet.`,
          },
        ],
        quiz: [
          { q: "How many bits are in an IPv4 address?", opts: ["16","32","48","64"], a: "32", explain: "IPv4 uses 32 bits, written as 4 octets in dotted decimal." },
          { q: "What does 127.0.0.1 represent?", opts: ["Your router","The internet gateway","Your own machine (loopback)","Google DNS"], a: "Your own machine (loopback)", explain: "127.0.0.1 (localhost) always refers to the machine you are currently on." },
          { q: "What is the binary value of the IP octet '192'?", opts: ["10000000","11000000","10100000","11100000"], a: "11000000", explain: "192 = 128+64 = 2⁷+2⁶ = 11000000." },
        ],
      },
      {
        id: "l3-3", title: "Subnet Masks & CIDR", duration: "10 min", xp: 45,
        sections: [
          {
            heading: "Why subnets exist",
            body: `An IP address has two parts:
  · Network ID — which network is this device on?
  · Host ID — which specific device on that network?

A subnet mask defines where the split is. It is a 32-bit number: all 1s covering the network part, all 0s covering the host part.

255.255.255.0 in binary:
  11111111.11111111.11111111.00000000
  ← 24 ones (network) →← 8 zeros (host) →`,
          },
          {
            heading: "CIDR notation",
            body: `Instead of writing the full mask we count the 1-bits:

  /8  = 255.0.0.0       → ~16 million hosts
  /16 = 255.255.0.0     → ~65,000 hosts
  /24 = 255.255.255.0   → 254 usable hosts
  /30 = 255.255.255.252 → 2 usable hosts (router links)
  /32 = a single host only

"192.168.1.0/24" means: network 192.168.1.x, hosts .1 through .254.`,
            visual: "subnet-slider",
          },
          {
            heading: "Finding the network address — Bitwise AND",
            body: `To find the network address: AND the IP with the mask.

IP:   192.168.1.130 = 11000000.10101000.00000001.10000010
Mask: 255.255.255.0 = 11111111.11111111.11111111.00000000
AND:  192.168.1.0   = 11000000.10101000.00000001.00000000

AND rule: 1 AND 1 = 1. Anything AND 0 = 0.
The mask zeroes out host bits, leaving only the network address.`,
          },
        ],
        quiz: [
          { q: "What does /24 mean in CIDR?", opts: ["24 hosts","First 24 bits are the network","Address version 24","Mask is 24 bytes long"], a: "First 24 bits are the network", explain: "/24 means 24 one-bits in the mask (255.255.255.0). Remaining 8 bits are hosts." },
          { q: "Which bitwise operation finds the network address?", opts: ["OR","XOR","AND","NOT"], a: "AND", explain: "Bitwise AND zeros out host bits wherever the mask is 0, leaving the network address." },
          { q: "How many usable hosts does a /24 subnet provide?", opts: ["254","255","256","512"], a: "254", explain: "/24 has 8 host bits = 256 addresses. Subtract .0 (network) and .255 (broadcast) = 254 usable." },
        ],
      },
      {
        id: "l3-4", title: "DNS & How Names Work", duration: "6 min", xp: 30,
        sections: [
          {
            heading: "The internet's phone book",
            body: `Computers communicate using IP addresses (like 142.250.80.46), but humans use names (like google.com). The Domain Name System (DNS) translates between them.

When you type "google.com" into your browser:
  1. Your device asks a DNS resolver: "what IP is google.com?"
  2. The resolver checks its cache or asks upstream DNS servers
  3. It returns an IP address (e.g. 142.250.80.46)
  4. Your browser connects to that IP

This usually happens in under 50ms.`,
          },
          {
            heading: "DNS hierarchy",
            body: `DNS is organised as a tree:

  . (root)
  └── com
      └── google
          └── www (→ 142.250.80.46)

Common DNS record types:
  A     — domain → IPv4 address
  AAAA  — domain → IPv6 address
  CNAME — alias to another domain
  MX    — mail server for domain
  TXT   — arbitrary text (used for verification)`,
          },
          {
            heading: "Common DNS servers",
            body: `  8.8.8.8 / 8.8.4.4   — Google Public DNS
  1.1.1.1 / 1.0.0.1   — Cloudflare (fastest, privacy-focused)
  9.9.9.9             — Quad9 (blocks malicious domains)

DNS runs on UDP port 53 (fast queries) or TCP port 53 (large responses).`,
          },
        ],
        quiz: [
          { q: "What does DNS do?", opts: ["Encrypts traffic","Translates domain names to IP addresses","Routes packets between networks","Assigns IP addresses"], a: "Translates domain names to IP addresses", explain: "DNS (Domain Name System) maps human-readable names like google.com to IP addresses." },
          { q: "Which DNS record maps a domain to an IPv4 address?", opts: ["AAAA","MX","CNAME","A"], a: "A", explain: "An 'A' record maps a domain to an IPv4 address. 'AAAA' maps to IPv6." },
          { q: "Which port does DNS use by default?", opts: ["80","443","53","22"], a: "53", explain: "DNS uses port 53, typically UDP for queries and TCP for large responses." },
        ],
      },
    ],
  },
  {
    id: "m4",
    title: "Binary Operations",
    emoji: "⚙️",
    color: "#c084fc",
    tagline: "How computers calculate at the bit level",
    lessons: [
      {
        id: "l4-1", title: "Bitwise AND, OR & XOR", duration: "8 min", xp: 35,
        sections: [
          {
            heading: "Operating on individual bits",
            body: `Bitwise operations work bit-by-bit on two numbers. They are the foundation of networking (subnet masks), graphics, encryption, and low-level programming.`,
          },
          {
            heading: "AND, OR, XOR truth tables",
            body: `AND (&): result is 1 only if BOTH inputs are 1
  1 & 1 = 1    1 & 0 = 0    0 & 0 = 0
  Use: masking bits, subnet calculation

OR (|): result is 1 if EITHER input is 1
  1 | 1 = 1    1 | 0 = 1    0 | 0 = 0
  Use: setting specific bits

XOR (^): result is 1 if inputs DIFFER
  1 ^ 1 = 0    1 ^ 0 = 1    0 ^ 0 = 0
  Use: toggling bits, simple encryption, checksums

NOT (~): flips all bits
  ~11001010 = 00110101`,
          },
          {
            heading: "Practical examples",
            body: `Checking if a number is odd (test bit 0):
  42 & 1 = 0  (even)
  43 & 1 = 1  (odd)

Forcing a bit ON (set bit 5 = add 32):
  65 | 32 = 97  ('A' → 'a', uppercase to lowercase)

Toggling a bit (flip bit 5):
  65 ^ 32 = 97  ('A' → 'a')
  97 ^ 32 = 65  ('a' → 'A')

Left shift (multiply by 2):
  1 << 3 = 8  (1 × 2³)

Right shift (divide by 2):
  16 >> 2 = 4  (16 ÷ 2²)`,
          },
        ],
        quiz: [
          { q: "What is 12 AND 10 in binary? (1100 & 1010)", opts: ["1110 (14)","1000 (8)","0010 (2)","1100 (12)"], a: "1000 (8)", explain: "1100 & 1010: only bit position 3 has 1 in both → 1000 = 8." },
          { q: "What operation checks if a number is odd?", opts: ["OR with 2","AND with 1","XOR with 1","NOT"], a: "AND with 1", explain: "n & 1 tests the LSB. 1 means odd, 0 means even." },
          { q: "What does XOR produce for two identical bits?", opts: ["1","0","Keeps them unchanged","Flips both"], a: "0", explain: "XOR = 1 only when inputs DIFFER. Same bits (1^1 or 0^0) always give 0." },
        ],
      },
      {
        id: "l4-2", title: "Two's Complement & Negative Numbers", duration: "9 min", xp: 40,
        sections: [
          {
            heading: "The problem with negative numbers",
            body: `Binary digits are just 0s and 1s — there is no minus sign. How do computers store -5?

The naive approach (sign-magnitude) uses the leftmost bit as a sign flag, but causes problems: +0 and -0 are different patterns, and addition needs special cases.

Two's complement solves all of this elegantly.`,
          },
          {
            heading: "How two's complement works",
            body: `To get the two's complement of a number:
  1. Write the positive version in binary
  2. Flip ALL bits (NOT operation)
  3. Add 1

Example: what is -5 in 8-bit two's complement?
  +5 =  00000101
  NOT:  11111010   (flip all bits)
  +1:   11111011   ← this is -5

Signed 8-bit range:   -128 to +127
Unsigned 8-bit range:    0 to 255`,
          },
          {
            heading: "Why this is brilliant",
            body: `With two's complement:

· Addition works the same for positive and negative numbers
· No special cases in hardware
· Only one representation of zero
· The MSB tells you the sign (1 = negative, 0 = positive)

This is why int8 goes -128 to 127, int16 goes -32768 to 32767, and int32 goes approximately -2.1 billion to +2.1 billion.`,
          },
        ],
        quiz: [
          { q: "What is the first step in finding two's complement?", opts: ["Add 1","Flip all bits","Divide by 2","Subtract from 256"], a: "Flip all bits", explain: "Step 1: flip all bits (NOT). Step 2: add 1." },
          { q: "In signed 8-bit two's complement, what is the range?", opts: ["0 to 255","-127 to 127","-128 to 127","-128 to 128"], a: "-128 to 127", explain: "Signed 8-bit: -2⁷ to 2⁷-1 = -128 to 127." },
          { q: "In two's complement, MSB = 1 means:", opts: ["Number is odd","Number is negative","Number is large","Number is unsigned"], a: "Number is negative", explain: "In two's complement, MSB=1 means negative, MSB=0 means zero or positive." },
        ],
      },
    ],
  },
];

export function loadProg(userId) {
  try {
    return JSON.parse(localStorage.getItem(`blprog_${userId || "guest"}`) || "{}");
  } catch { return {}; }
}

export function saveProg(userId, data) {
  try {
    localStorage.setItem(`blprog_${userId || "guest"}`, JSON.stringify(data));
  } catch {}
}

export function isUnlocked(lessonId, moduleId, progress) {
  const mod = MODULES.find((m) => m.id === moduleId);
  if (!mod) return false;
  const idx = mod.lessons.findIndex((l) => l.id === lessonId);
  if (idx === 0) {
    const mIdx = MODULES.findIndex((m) => m.id === moduleId);
    if (mIdx === 0) return true;
    return MODULES[mIdx - 1].lessons.every((l) => progress[l.id]?.passed);
  }
  return !!progress[mod.lessons[idx - 1].id]?.passed;
}

export const TOTAL_LESSONS = MODULES.reduce((s, m) => s + m.lessons.length, 0);

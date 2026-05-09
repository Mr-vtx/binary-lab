import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

// ─── Lesson data ──────────────────────────────────────────────────────────────
const MODULES = [
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

You do not need to memorise all 7. Focus on layers 3 (IP) and 4 (TCP/UDP) — they power the internet.`,
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

These private ranges never appear on the public internet. They are re-used inside millions of separate networks, which is how we stretch 4.3 billion addresses across billions more devices.`,
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
            body: `Computers communicate using IP addresses (like 142.250.80.46), but humans use names (like google.com). The Domain Name System (DNS) is what translates between them.

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

Records are cached at each level. Your router, ISP, and browser all cache DNS answers so they do not look up the same domain every time.

Common DNS record types:
  A     — domain → IPv4 address
  AAAA  — domain → IPv6 address
  CNAME — alias to another domain
  MX    — mail server for domain
  TXT   — arbitrary text (used for verification)`,
          },
          {
            heading: "Common DNS servers",
            body: `Your ISP assigns a DNS server automatically, but you can change it:

  8.8.8.8 / 8.8.4.4   — Google Public DNS
  1.1.1.1 / 1.0.0.1   — Cloudflare (fastest, privacy-focused)
  9.9.9.9             — Quad9 (blocks malicious domains)

DNS runs on UDP port 53 (fast, small queries) or TCP port 53 (large responses / zone transfers).`,
          },
        ],
        quiz: [
          { q: "What does DNS do?", opts: ["Encrypts your traffic","Translates domain names to IP addresses","Routes packets between networks","Assigns IP addresses to devices"], a: "Translates domain names to IP addresses", explain: "DNS (Domain Name System) maps human-readable names like google.com to IP addresses." },
          { q: "Which DNS record type maps a domain to an IPv4 address?", opts: ["AAAA","MX","CNAME","A"], a: "A", explain: "An 'A' record maps a domain to an IPv4 address. 'AAAA' maps to IPv6." },
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
            body: `Bitwise operations work bit-by-bit on two numbers. They are the foundation of networking (subnet masks), graphics, encryption, and low-level programming.

There are four main operations: AND, OR, XOR, NOT.`,
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
  ~11001010 = 00110101
  Use: creating wildcard masks (inverse of subnet mask)`,
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
          { q: "What operation is used to check if a number is odd?", opts: ["OR with 2","AND with 1","XOR with 1","NOT"], a: "AND with 1", explain: "n & 1 tests the least significant bit. 1 means odd, 0 means even." },
          { q: "What does XOR do to two identical bits?", opts: ["Produces 1","Produces 0","Keeps them unchanged","Flips both"], a: "Produces 0", explain: "XOR = 1 only when inputs DIFFER. Same bits (1^1 or 0^0) always give 0." },
        ],
      },
      {
        id: "l4-2", title: "Two's Complement & Negative Numbers", duration: "9 min", xp: 40,
        sections: [
          {
            heading: "The problem with negative numbers",
            body: `Binary digits are just 0s and 1s — there is no minus sign. How do computers store -5?

The naive approach (sign-magnitude) uses the leftmost bit as a sign flag. But this causes problems: +0 and -0 are different bit patterns, and addition circuits need special cases.

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

Check: 00000101 + 11111011 = 100000000
       (the carry overflows out of 8 bits = 0 ✓)

Signed 8-bit range: -128 to +127
Unsigned 8-bit range: 0 to 255`,
          },
          {
            heading: "Why this is brilliant",
            body: `With two's complement:

· Addition works the same for positive and negative numbers
· No special cases in hardware
· Only one representation of zero
· The MSB tells you the sign (1 = negative, 0 = positive)

Modern CPUs use two's complement for all integer arithmetic. It is why int8 in most languages goes -128 to 127, int16 goes -32768 to 32767, and int32 goes approximately -2.1 billion to +2.1 billion.`,
          },
        ],
        quiz: [
          { q: "What is the first step in finding two's complement of a number?", opts: ["Add 1","Flip all bits","Divide by 2","Subtract from 256"], a: "Flip all bits", explain: "Step 1: flip all bits (NOT operation). Step 2: add 1. The result is the two's complement." },
          { q: "In signed 8-bit two's complement, what is the range?", opts: ["0 to 255","-127 to 127","-128 to 127","-128 to 128"], a: "-128 to 127", explain: "Signed 8-bit: 1 bit for sign leaves 7 bits. Range is -2⁷ to 2⁷-1 = -128 to 127." },
          { q: "In two's complement, a 1 in the MSB (leftmost bit) means:", opts: ["The number is odd","The number is negative","The number is large","The number is unsigned"], a: "The number is negative", explain: "In two's complement, MSB=1 means negative. MSB=0 means zero or positive." },
        ],
      },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function loadProg(userId) {
  try { return JSON.parse(localStorage.getItem(`blprog_${userId || "guest"}`) || "{}"); } catch { return {}; }
}
function saveProg(userId, data) {
  try { localStorage.setItem(`blprog_${userId || "guest"}`, JSON.stringify(data)); } catch {}
}
function isUnlocked(lessonId, moduleId, progress) {
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

// ─── Interactive visuals ───────────────────────────────────────────────────────
function BinaryCount() {
  const rows = Array.from({ length: 8 }, (_, i) => ({ dec: i, bin: i.toString(2).padStart(3, "0") }));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
      {rows.map(({ dec, bin }) => (
        <div key={dec} style={{ display: "flex", alignItems: "center", gap: 12, background: "#080b0e", border: "1px solid #1a2030", borderRadius: 4, padding: "5px 10px" }}>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#6b8a7a", width: 20 }}>{dec}</span>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#00ff88", letterSpacing: "0.15em" }}>{bin}</span>
        </div>
      ))}
    </div>
  );
}

function BitWeights() {
  const weights = [128, 64, 32, 16, 8, 4, 2, 1];
  const [on, setOn] = useState([]);
  const total = on.reduce((s, i) => s + weights[i], 0);
  return (
    <div>
      <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040", marginBottom: 8 }}>Click the bits to add their values:</p>
      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
        {weights.map((w, i) => {
          const active = on.includes(i);
          return (
            <button key={i} onClick={() => setOn((a) => active ? a.filter((x) => x !== i) : [...a, i])}
              style={{
                flex: 1, border: `1px solid ${active ? "#00ff88" : "#1a2030"}`,
                borderRadius: 5, padding: "8px 0", background: active ? "#0d1f14" : "#080b0e",
                cursor: "pointer", textAlign: "center", boxShadow: active ? "0 0 8px #00ff8833" : "none",
                transition: "all 0.12s",
              }}>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: active ? "#00ff88" : "#3a5040", marginBottom: 3 }}>{w}</div>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 16, fontWeight: 700, color: active ? "#00ff88" : "#3a5040" }}>{active ? "1" : "0"}</div>
            </button>
          );
        })}
      </div>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#6b8a7a" }}>
        = <span style={{ color: "#00ff88", fontSize: 24, fontWeight: 700 }}>{total}</span>
        <span style={{ color: "#3a5040", marginLeft: 8 }}>decimal</span>
      </div>
    </div>
  );
}

function ByteDiagram() {
  return (
    <div>
      <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
        {[7,6,5,4,3,2,1,0].map((b) => (
          <div key={b} style={{
            flex: 1, textAlign: "center", padding: "8px 0", borderRadius: 4, fontSize: 10,
            fontFamily: "JetBrains Mono",
            background: b >= 4 ? "#05161a" : "#1a1400",
            border: `1px solid ${b >= 4 ? "#00d4ff30" : "#ffb80030"}`,
            color: b >= 4 ? "#00d4ff" : "#ffb800",
          }}>
            b{b}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", marginBottom: 6 }}>
        <span style={{ flex: 4, textAlign: "center", color: "#00d4ff80" }}>← high nybble (bits 7–4) →</span>
        <span style={{ flex: 4, textAlign: "center", color: "#ffb80080" }}>← low nybble (bits 3–0) →</span>
      </div>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#3a5040", textAlign: "center" }}>
        1 byte = 8 bits = 2 nybbles = 256 possible values (0–255)
      </div>
    </div>
  );
}

function AsciiGrid() {
  const chars = [["A",65],["B",66],["Z",90],["a",97],["z",122],["0",48],["9",57],[" ",32],["!",33],["~",126]];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
      {chars.map(([ch, code]) => (
        <div key={code} style={{ background: "#080b0e", border: "1px solid #1a2030", borderRadius: 5, padding: "8px 4px", textAlign: "center" }}>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 16, color: "#00ff88", marginBottom: 3 }}>{ch === " " ? "·" : ch}</div>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#ffb800" }}>{code}</div>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 8, color: "#3a5040", marginTop: 2 }}>{code.toString(2).padStart(8,"0")}</div>
        </div>
      ))}
    </div>
  );
}

function HexMap() {
  const entries = [["0","0000"],["1","0001"],["2","0010"],["3","0011"],["4","0100"],["5","0101"],["6","0110"],["7","0111"],["8","1000"],["9","1001"],["A","1010"],["B","1011"],["C","1100"],["D","1101"],["E","1110"],["F","1111"]];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
      {entries.map(([h, b]) => (
        <div key={h} style={{ display: "flex", gap: 8, background: "#080b0e", border: "1px solid #1a2030", borderRadius: 4, padding: "4px 8px", alignItems: "center" }}>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#ffb800", fontWeight: 700, width: 14 }}>{h}</span>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#00d4ff" }}>{b}</span>
        </div>
      ))}
    </div>
  );
}

function IpBuilder() {
  const [ip, setIp] = useState("192.168.1.1");
  const octets = ip.split(".").map(Number);
  const valid = octets.length === 4 && octets.every((o) => !isNaN(o) && o >= 0 && o <= 255);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <input className="terminal-input" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="e.g. 192.168.1.1" style={{ fontSize: 13 }} />
      {valid && (
        <div style={{ display: "flex", gap: 4 }}>
          {octets.map((oct, i) => (
            <div key={i} style={{ flex: 1, background: "#080b0e", border: "1px solid #1a2030", borderRadius: 5, padding: "8px 4px", textAlign: "center" }}>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#e8f5ef" }}>{oct}</div>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#00d4ff", marginTop: 4, letterSpacing: "0.05em" }}>{oct.toString(2).padStart(8,"0")}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SubnetSlider() {
  const [prefix, setPrefix] = useState(24);
  const mask = Array.from({ length: 32 }, (_, i) => i < prefix ? 1 : 0);
  const octets = [0,8,16,24].map((s) => parseInt(mask.slice(s,s+8).join(""),2));
  const hosts = Math.pow(2, 32 - prefix);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#3a5040" }}>Prefix:</span>
        <input type="range" min={1} max={32} value={prefix} onChange={(e) => setPrefix(+e.target.value)} style={{ flex: 1 }} />
        <span style={{ fontFamily: "JetBrains Mono", fontSize: 14, color: "#00d4ff", fontWeight: 700, width: 32 }}>/{prefix}</span>
      </div>
      <div style={{ display: "flex", gap: 2, flexWrap: "nowrap" }}>
        {mask.map((bit, i) => (
          <div key={i} style={{
            width: 13, height: 20, borderRadius: 2, flexShrink: 0,
            background: bit ? "#00d4ff25" : "#ff335515",
            border: `1px solid ${bit ? "#00d4ff40" : "#ff335530"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "JetBrains Mono", fontSize: 9,
            color: bit ? "#00d4ff" : "#ff3355",
            marginLeft: i > 0 && i % 8 === 0 ? 4 : 0,
          }}>
            {bit}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#6b8a7a" }}>
        Mask: <span style={{ color: "#00d4ff" }}>{octets.join(".")}</span>
        &nbsp;·&nbsp; Total addresses: <span style={{ color: "#00ff88" }}>{hosts.toLocaleString()}</span>
        &nbsp;·&nbsp; Usable: <span style={{ color: "#00ff88" }}>{Math.max(0, hosts - 2).toLocaleString()}</span>
      </div>
    </div>
  );
}

const VISUALS = {
  "binary-count": BinaryCount,
  "bit-weights":  BitWeights,
  "byte-diagram": ByteDiagram,
  "ascii-grid":   AsciiGrid,
  "hex-map":      HexMap,
  "ip-builder":   IpBuilder,
  "subnet-slider": SubnetSlider,
};

// ─── Mini quiz ─────────────────────────────────────────────────────────────────
function MiniQuiz({ questions, onPass, onFail }) {
  const [qi, setQi]         = useState(0);
  const [chosen, setChosen] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [done, setDone]     = useState(false);
  const q = questions[qi];
  const isLast = qi === questions.length - 1;
  const score = answers.filter(Boolean).length;

  const next = () => {
    const correct = chosen === q.a;
    const na = [...answers, correct];
    if (isLast) {
      setAnswers(na); setDone(true);
      na.filter(Boolean).length / questions.length >= 0.67 ? onPass(na) : onFail(na);
    } else {
      setAnswers(na); setQi(qi + 1); setChosen(null);
    }
  };

  if (done) {
    const passed = score / questions.length >= 0.67;
    return (
      <div style={{ background: passed ? "#0d1f14" : "#0e1117", border: `1px solid ${passed ? "#00ff8830" : "#1a2030"}`, borderRadius: 8, padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>{passed ? "🎉" : "📖"}</div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: passed ? "#00ff88" : "#ffb800", fontWeight: 600, marginBottom: 6 }}>
          {passed ? "Lesson complete!" : "Review and try again"}
        </div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#3a5040", marginBottom: passed ? 0 : 14 }}>
          {score}/{questions.length} correct
        </div>
        {!passed && (
          <button className="btn-ghost" onClick={() => { setQi(0); setAnswers([]); setChosen(null); setDone(false); }}>
            Try again →
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Question {qi + 1}/{questions.length}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {questions.map((_, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < qi ? (answers[i] ? "#00ff88" : "#ff3355") : i === qi ? "#ffb800" : "#1a2030" }} />
          ))}
        </div>
      </div>
      <div style={{ background: "#080b0e", border: "1px solid #1a2030", borderRadius: 8, padding: "16px" }}>
        <p style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#a8c8b8", marginBottom: 12, lineHeight: 1.7 }}>{q.q}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {q.opts.map((opt) => {
            let bg = "none", border = "#1a2030", color = "#6b8a7a";
            if (chosen) {
              if (opt === q.a)           { bg = "#0d1f14"; border = "#00ff88"; color = "#00ff88"; }
              else if (opt === chosen)   { bg = "#1a0a0d"; border = "#ff3355"; color = "#ff3355"; }
              else                       { color = "#2a3a2a"; }
            }
            return (
              <button key={opt} onClick={() => !chosen && setChosen(opt)} disabled={!!chosen}
                style={{ textAlign: "left", background: bg, border: `1px solid ${border}`, borderRadius: 6, padding: "10px 14px", fontFamily: "JetBrains Mono", fontSize: 12, color, cursor: chosen ? "default" : "pointer", transition: "all 0.12s" }}>
                {opt}
              </button>
            );
          })}
        </div>
        {chosen && (
          <div style={{ marginTop: 12 }} className="panel-animate">
            <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: chosen === q.a ? "#00ff88" : "#ff3355", marginBottom: 6 }}>
              {chosen === q.a ? "✓ Correct!" : `✗ Answer: ${q.a}`}
            </p>
            {q.explain && <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#3a5040", lineHeight: 1.7, marginBottom: 12 }}>{q.explain}</p>}
            <button className="btn-primary" onClick={next}>{isLast ? "Finish →" : "Next →"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Lesson viewer ─────────────────────────────────────────────────────────────
function LessonView({ lesson, mod, completed, onComplete }) {
  const [quizOpen, setQuizOpen] = useState(false);
  return (
    <div className="panel-animate" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ background: "#0e1117", border: "1px solid #1a2030", borderRadius: 8, padding: "16px 20px" }}>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: mod.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
          {mod.emoji} {mod.title}
        </div>
        <h2 style={{ fontFamily: "Share Tech Mono", fontSize: 18, color: "#e8f5ef", marginBottom: 8, letterSpacing: "0.04em" }}>{lesson.title}</h2>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040" }}>🕐 {lesson.duration}</span>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#ffb800" }}>+{lesson.xp} XP</span>
          {completed && <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#00ff88" }}>✓ completed</span>}
        </div>
      </div>

      {/* Sections */}
      {lesson.sections.map((sec, i) => {
        const Visual = sec.visual ? VISUALS[sec.visual] : null;
        return (
          <div key={i} style={{ background: "#0e1117", border: "1px solid #1a2030", borderRadius: 8, padding: "16px 20px" }}>
            <h3 style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#e8f5ef", fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: mod.color, opacity: 0.6 }}>{String(i+1).padStart(2,"0")}</span>
              {sec.heading}
            </h3>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#6b8a7a", lineHeight: 1.85, whiteSpace: "pre-line", marginBottom: Visual ? 16 : 0 }}>
              {sec.body}
            </div>
            {Visual && (
              <div style={{ borderTop: "1px solid #1a2030", paddingTop: 14 }}>
                <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
                  ▸ Interactive
                </div>
                <Visual />
              </div>
            )}
          </div>
        );
      })}

      {/* Quiz */}
      <div style={{ background: "#0e1117", border: "1px solid #1a2030", borderRadius: 8, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: quizOpen ? 16 : 0 }}>
          <div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#e8f5ef", fontWeight: 600 }}>Check your understanding</div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040", marginTop: 3 }}>
              Answer {Math.ceil(lesson.quiz.length * 0.67)}/{lesson.quiz.length} correctly to complete this lesson
            </div>
          </div>
          {!quizOpen && (
            <button className="btn-primary" onClick={() => setQuizOpen(true)}>
              {completed ? "Review quiz" : "Start quiz →"}
            </button>
          )}
        </div>
        {quizOpen && (
          <MiniQuiz
            questions={lesson.quiz}
            onPass={(a) => onComplete(true, a)}
            onFail={(a) => onComplete(false, a)}
          />
        )}
      </div>
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────
function LearnSidebar({ progress, selected, onSelect }) {
  const [expanded, setExpanded] = useState({ m1: true, m2: true, m3: true, m4: true });
  const total = MODULES.reduce((s, m) => s + m.lessons.length, 0);
  const done  = Object.values(progress).filter((p) => p.passed).length;
  const pct   = Math.round((done / total) * 100);

  return (
    <div style={{ width: 210, flexShrink: 0, background: "#080b0e", border: "1px solid #1a2030", borderRadius: 8, overflow: "hidden", alignSelf: "flex-start", position: "sticky", top: 0 }}>
      <div style={{ padding: "12px 14px", borderBottom: "1px solid #1a2030" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", textTransform: "uppercase", letterSpacing: "0.1em" }}>Progress</span>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#00ff88" }}>{done}/{total}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div style={{ padding: "8px" }}>
        {MODULES.map((mod) => {
          const open       = expanded[mod.id];
          const modDone    = mod.lessons.every((l) => progress[l.id]?.passed);
          const firstLesson = mod.lessons[0];
          const modUnlocked = isUnlocked(firstLesson.id, mod.id, progress);

          return (
            <div key={mod.id}>
              <button
                onClick={() => setExpanded((e) => ({ ...e, [mod.id]: !e[mod.id] }))}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 7, padding: "7px 6px", borderRadius: 5, background: "none", border: "none", cursor: "pointer" }}
              >
                <span style={{ fontSize: 13 }}>{mod.emoji}</span>
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, flex: 1, textAlign: "left", color: modUnlocked ? "#a8c8b8" : "#3a5040" }}>
                  {mod.title}
                </span>
                {modDone && <span style={{ color: "#00ff88", fontSize: 11 }}>✓</span>}
                {!modUnlocked && <span style={{ color: "#3a5040", fontSize: 10 }}>🔒</span>}
                <span style={{ color: "#3a5040", fontSize: 10 }}>{open ? "▾" : "▸"}</span>
              </button>

              {open && (
                <div style={{ marginLeft: 8, paddingLeft: 10, borderLeft: "1px solid #1a2030", marginBottom: 4 }}>
                  {mod.lessons.map((lesson) => {
                    const unl   = isUnlocked(lesson.id, mod.id, progress);
                    const ldone = !!progress[lesson.id]?.passed;
                    const isSel = selected?.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        disabled={!unl}
                        onClick={() => unl && onSelect(lesson, mod)}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: 7, padding: "6px 8px",
                          borderRadius: 5, background: isSel ? "#0d1f14" : "none",
                          border: `1px solid ${isSel ? "#00ff8820" : "transparent"}`,
                          cursor: unl ? "pointer" : "not-allowed", opacity: unl ? 1 : 0.4,
                          marginBottom: 2,
                        }}
                      >
                        <span style={{ fontSize: 11, flexShrink: 0 }}>{ldone ? "✅" : unl ? "○" : "🔒"}</span>
                        <span style={{ fontFamily: "JetBrains Mono", fontSize: 10.5, flex: 1, textAlign: "left", color: isSel ? "#00ff88" : unl ? "#6b8a7a" : "#3a5040", lineHeight: 1.3 }}>
                          {lesson.title}
                        </span>
                        <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", flexShrink: 0 }}>+{lesson.xp}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Welcome screen ────────────────────────────────────────────────────────────
function Welcome({ onStart }) {
  return (
    <div className="panel-animate" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#0e1117", border: "1px solid #1a2030", borderRadius: 8, padding: "28px", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>💡</div>
        <h2 className="font-display glow-green" style={{ color: "#00ff88", fontSize: 20, letterSpacing: "0.1em", marginBottom: 10 }}>
          Welcome to Learn
        </h2>
        <p style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#6b8a7a", lineHeight: 1.8, maxWidth: 440, margin: "0 auto 20px" }}>
          A structured guide for complete beginners. No experience needed — start from zero and work through binary, text encoding, networking, and bitwise operations.
        </p>
        <button className="btn-primary" style={{ fontSize: 13, padding: "10px 24px" }} onClick={onStart}>
          Begin Lesson 1 →
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
        {MODULES.map((mod) => (
          <div key={mod.id} style={{ background: "#0e1117", border: `1px solid ${mod.color}20`, borderRadius: 8, padding: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{mod.emoji}</span>
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: mod.color, fontWeight: 600 }}>{mod.title}</span>
            </div>
            <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040", marginBottom: 6 }}>{mod.tagline}</p>
            <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040" }}>{mod.lessons.length} lessons</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function Learn() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(() => loadProg(user?.id));
  const [selected, setSelected] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setProgress(loadProg(user?.id)); }, [user?.id]);

  const handleComplete = (passed) => {
    if (!selected) return;
    const np = { ...progress, [selected.lesson.id]: { passed, at: Date.now() } };
    setProgress(np);
    saveProg(user?.id, np);
  };

  const handleSelect = (lesson, mod) => {
    setSelected({ lesson, module: mod });
    setSidebarOpen(false);
  };

  return (
    <div className="panel-animate">
      {/* Mobile sidebar toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040" }}>
          {Object.values(progress).filter((p) => p.passed).length} / {MODULES.reduce((s,m)=>s+m.lessons.length,0)} lessons complete
        </span>
        <button
          className="btn-ghost"
          style={{ display: "none" }} // shown via CSS on mobile
          onClick={() => setSidebarOpen((v) => !v)}
        >
          {sidebarOpen ? "✕ close" : "☰ lessons"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* Sidebar */}
        <div style={{ flexShrink: 0 }}>
          <LearnSidebar
            progress={progress}
            selected={selected?.lesson}
            onSelect={handleSelect}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {selected ? (
            <LessonView
              key={selected.lesson.id}
              lesson={selected.lesson}
              mod={selected.module}
              completed={!!progress[selected.lesson.id]?.passed}
              onComplete={handleComplete}
            />
          ) : (
            <Welcome onStart={() => handleSelect(MODULES[0].lessons[0], MODULES[0])} />
          )}
        </div>
      </div>
    </div>
  );
}

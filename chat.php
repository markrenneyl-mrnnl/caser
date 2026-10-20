<?php
// Optional real-AI backend for the "Ask AI" chat. Without it, the site uses its built-in answers.
// 1) Paste your Anthropic API key below.  2) Upload this file next to index.html.
// Never put the key in script.js - anyone could see it.
header('Content-Type: application/json');
session_start();

$API_KEY = 'PASTE_YOUR_ANTHROPIC_API_KEY_HERE';
$MODEL   = 'claude-haiku-4-5-20251001';

$SYSTEM = "You are the AI assistant on Kylie Gwen Caser's personal portfolio website. Answer visitors' questions about Kylie in a friendly, concise, professional way (max 3-4 sentences). Use ONLY these facts; if something is not listed, say you don't know and suggest the contact form.
FACTS: BS Information Technology student at King's College of the Philippines-Bambang, Inc. Aspiring IT professional focused on web and software development. Skills: HTML, CSS, JavaScript, responsive web design and UI layout, Java, MySQL, Canva, Microsoft Word and PowerPoint, basic networking and server concepts. Projects: Grocery Store POS (Java, MySQL desktop app for products, sales, users, payments); IoT Smart Parking (Arduino with ultrasonic sensors, LCD, LEDs, buzzer, servo barriers); Responsive Portfolio (HTML, CSS, JavaScript). Leadership: Student Officer in ICSO Department; Treasurer of Main Department Organization; Secretary of Indigenous Group Organization; Student Officer at Dupax del Sur National High School. Interests: technology, travel, sports, games, learning. Goal: build useful, simple, user-friendly technology solutions. Contact: the contact form at the bottom of the page. Politely decline unrelated requests.";

function fail($code) { http_response_code($code); echo json_encode(['error' => 'unavailable']); exit; }

if ($API_KEY === 'PASTE_YOUR_ANTHROPIC_API_KEY_HERE') fail(503);

// Simple rate limit: 10 messages per minute per visitor
$now = time();
$_SESSION['t'] = array_values(array_filter($_SESSION['t'] ?? [], fn($x) => $now - $x < 60));
if (count($_SESSION['t']) >= 10) fail(429);
$_SESSION['t'][] = $now;

$in = json_decode(file_get_contents('php://input'), true);
$msg = trim(substr((string)($in['message'] ?? ''), 0, 300));
if ($msg === '') fail(400);

$messages = [];
foreach (array_slice($in['history'] ?? [], -6) as $h) {
    $role = ($h['role'] ?? '') === 'assistant' ? 'assistant' : 'user';
    $text = substr((string)($h['content'] ?? ''), 0, 500);
    if ($text === '' || (!$messages && $role !== 'user')) continue;
    if ($messages && end($messages)['role'] === $role) continue;
    $messages[] = ['role' => $role, 'content' => $text];
}
if ($messages && end($messages)['role'] === 'user') array_pop($messages);
$messages[] = ['role' => 'user', 'content' => $msg];

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 20,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'x-api-key: ' . $API_KEY, 'anthropic-version: 2023-06-01'],
    CURLOPT_POSTFIELDS => json_encode(['model' => $MODEL, 'max_tokens' => 300, 'system' => $SYSTEM, 'messages' => $messages]),
]);
$res = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
if ($res === false || $code !== 200) fail(502);

$data = json_decode($res, true);
$reply = $data['content'][0]['text'] ?? '';
if ($reply === '') fail(502);
echo json_encode(['reply' => $reply]);

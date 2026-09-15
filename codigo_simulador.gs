// =========================================================
// SIMULADOR CPU x86 - ARQUITECTURA 8 BITS
// =========================================================

function inicializarJuegoCPU() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  hoja.clear();
  hoja.setHiddenGridlines(true); 
  hoja.getRange("A1:Z50").setBackground("#1e1e1e"); 

  // --- TÍTULO Y CONTROLES ---
  hoja.getRange("B2:X3").merge().setValue("⚡ SIMULADOR CPU x86 - ARQUITECTURA DE 8 BITS ⚡")
    .setFontWeight("bold").setFontSize(16).setFontColor("#00ffcc")
    .setHorizontalAlignment("center").setVerticalAlignment("middle");
  
  // --- PANEL IZQUIERDO: HUD CPU ---
  hoja.getRange("B5:E5").merge().setValue("💻 REGISTROS DE LA CPU")
    .setBackground("#3a0088").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
  
  var etiquetasCPU = [
    ["PC (Program Counter)", "00", "Apunta a RAM"],
    ["MAR (Memory Address)", "00", "Bus de Direcciones"],
    ["MDR (Memory Data)", "00", "Bus de Datos"],
    ["IR (Instruction Reg.)", "00", "Opcode Actual"],
    ["AX (Acumulador)", "00", "Propósito General"],
    ["BX (Registro Base)", "00", "Propósito General"]
  ];
  hoja.getRange("B6:D11").setValues(etiquetasCPU).setFontColor("white").setBorder(true, true, true, true, true, true, "#555555", null);
  hoja.getRange("C6:C11").setBackground("#000000").setFontColor("#00ffcc").setFontWeight("bold").setHorizontalAlignment("center").setFontFamily("Courier New");

  // --- BANDERAS ---
  hoja.getRange("B13:D13").merge().setValue("🚩 BANDERAS DE ESTADO (FLAGS)")
    .setBackground("#880000").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
  var banderas = [["ZF (Zero)", "0"], ["CF (Carry)", "0"], ["SF (Sign)", "0"]];
  hoja.getRange("B14:C16").setValues(banderas).setFontColor("white").setBorder(true, true, true, true, true, true, "#555555", null);
  hoja.getRange("C14:C16").setBackground("#000000").setFontColor("#ff0055").setFontWeight("bold").setHorizontalAlignment("center");

  // --- PANEL CENTRAL: CICLO ---
  hoja.getRange("F5:G5").merge().setValue("🔄 CICLO DE RELOJ").setBackground("#005588").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
  var fases = [
    ["1. FETCH", "Pendiente"],
    ["2. DECODE", "Pendiente"],
    ["3. EXECUTE", "Pendiente"],
    ["4. STORE", "Pendiente"]
  ];
  hoja.getRange("F6:G9").setValues(fases).setFontColor("white").setBorder(true, true, true, true, true, true, "#555555", null);
  hoja.getRange("G6:G9").setFontColor("#777777").setHorizontalAlignment("center"); 

  // --- PANEL DERECHO: MEMORIA ---
  hoja.getRange("I5:Y5").merge().setValue("💾 MEMORIA PRINCIPAL (RAM 256 Bytes)")
    .setBackground("#006622").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
  
  var columnas = [["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]];
  hoja.getRange("J6:Y6").setValues(columnas).setBackground("#222222").setFontColor("#00ffcc").setHorizontalAlignment("center").setFontWeight("bold");

  for (var i = 0; i < 16; i++) {
    var filaHex = i.toString(16).toUpperCase() + "0";
    hoja.getRange(7 + i, 9).setValue(filaHex).setBackground("#222222").setFontColor("#00ffcc").setHorizontalAlignment("center").setFontWeight("bold");
    for (var j = 0; j < 16; j++) {
      hoja.getRange(7 + i, 10 + j).setValue("00").setBackground("#111111").setFontColor("white").setHorizontalAlignment("center").setFontFamily("Courier New");
    }
  }
  hoja.getRange("I6:Y22").setBorder(true, true, true, true, true, true, "#333333", null);
  hoja.setColumnWidths(10, 16, 35); 

  // --- LOG DE BATALLA ---
  hoja.getRange("B18:G18").merge().setValue("📜 LOG DE MICRO-OPERACIONES")
    .setBackground("#333333").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
  hoja.getRange("B19:G26").merge().setBackground("#000000").setFontColor("#00ff00").setFontFamily("Courier New").setVerticalAlignment("top");
  hoja.getRange("B19").setValue("> Sistema inicializado...\n> Esperando cargar programa...");
}

// =========================================================
// FUNCIONES DE MEMORIA (ACTUALIZADAS AL NUEVO MAPA)
// =========================================================

function readRAM(direccionHex) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var decDir = parseInt(direccionHex, 16);
  var fila = Math.floor(decDir / 16) + 7; // Inicia en la fila 7 del nuevo diseño
  var col = (decDir % 16) + 10;           // Inicia en la columna J (10)
  return hoja.getRange(fila, col).getValue();
}

function writeRAM(direccionHex, valorHex) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var decDir = parseInt(direccionHex, 16);
  var fila = Math.floor(decDir / 16) + 7;
  var col = (decDir % 16) + 10;
  var valorFormateado = ("00" + valorHex.toString(16).toUpperCase()).slice(-2);
  hoja.getRange(fila, col).setValue(valorFormateado);
}

// =========================================================
// LÓGICA DE LA CPU - ISSUE 3
// =========================================================

function getRegistro(celda) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  return hoja.getRange(celda).getValue().toString();
}

function setRegistro(celda, valor) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var valorHex = ("00" + valor.toString().toUpperCase()).slice(-2); 
  hoja.getRange(celda).setValue(valorHex);
}

function agregarLog(mensaje) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var celdaLog = hoja.getRange("B19");
  var logActual = celdaLog.getValue();
  
  var lineas = logActual.split("\n");
  if (lineas.length > 7) lineas.shift(); 
  lineas.push("> " + mensaje);
  celdaLog.setValue(lineas.join("\n"));
  
  SpreadsheetApp.flush(); 
  Utilities.sleep(500); // Pausa de medio segundo para ver la animación
}

// --- FASE 1: FETCH (Búsqueda) ---
function ejecutarFetch() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // 1. Efecto visual: Encender panel central
  hoja.getRange("G6").setValue("ACTIVO 🟢").setFontColor("#00ff00").setFontWeight("bold");
  agregarLog("Iniciando fase FETCH...");
  
  // 2. MAR <- PC
  var pc = getRegistro("C6"); 
  setRegistro("C7", pc); 
  agregarLog("MAR <- PC (Apunta a la dirección " + pc + ")");
  
  // 3. MDR <- RAM[MAR]
  var instruccion = readRAM(pc); 
  setRegistro("C8", instruccion);
  agregarLog("MDR <- RAM[" + pc + "] (Dato extraído: " + instruccion + ")");
  
  // 4. IR <- MDR
  setRegistro("C9", instruccion);
  agregarLog("IR <- MDR (Instrucción " + instruccion + " lista)");
  
  // 5. PC <- PC + 1
  var pcDec = parseInt(pc, 16);
  pcDec = (pcDec + 1) % 256; 
  var pcNuevoHex = pcDec.toString(16).toUpperCase();
  setRegistro("C6", pcNuevoHex);
  agregarLog("PC incrementado a " + pcNuevoHex);
  
  // Apagar indicador de fase
  hoja.getRange("G6").setValue("Completado").setFontColor("#777777").setFontWeight("normal");
}

// --- FASE 2: DECODE (Decodificación de la ISA) ---
function ejecutarDecode() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  hoja.getRange("G7").setValue("ACTIVO 🟢").setFontColor("#00ff00").setFontWeight("bold");
  
  var ir = getRegistro("C9");
  var instruccion = "";
  
  // Diccionario de Arquitectura de Instrucciones (ISA)
  switch(ir) {
    case "00": instruccion = "HLT (Detener Reloj)"; break;
    case "A5": instruccion = "INC AX (Sumar 1 a AX)"; break;
    case "01": instruccion = "ADD AX, BX (AX <- AX + BX)"; break;
    case "02": instruccion = "SUB AX, BX (AX <- AX - BX)"; break;
    case "8B": instruccion = "MOV AX, BX (Copiar BX en AX)"; break;
    case "3B": instruccion = "CMP AX, BX (Comparar y fijar Banderas)"; break;
    default: instruccion = "Instrucción desconocida";
  }
  
  agregarLog("Decode: " + ir + " -> " + instruccion);
  hoja.getRange("G7").setValue("Completado").setFontColor("#777777").setFontWeight("normal");
}

// --- FASE 3 y 4: EXECUTE & STORE (ALU) ---
function ejecutarExecute() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  hoja.getRange("G8").setValue("ACTIVO 🟢").setFontColor("#00ff00").setFontWeight("bold");
  hoja.getRange("G9").setValue("ACTIVO 🟢").setFontColor("#00ff00").setFontWeight("bold");
  
  var ir = getRegistro("C9");
  var ax = parseInt(getRegistro("C10"), 16);
  var bx = parseInt(getRegistro("C11"), 16);
  var resultado = ax;
  
  // Lógica Matemática de la ALU
  if (ir === "A5") { resultado = (ax + 1) % 256; } 
  else if (ir === "01") { resultado = (ax + bx) % 256; }
  else if (ir === "02") { resultado = (ax - bx + 256) % 256; }
  else if (ir === "8B") { resultado = bx; }
  
  // FASE 4: STORE (Almacenamiento)
  if (["A5", "01", "02", "8B"].includes(ir)) {
    setRegistro("C10", resultado);
    hoja.getRange("C14").setValue((resultado === 0) ? "1" : "0"); // ZF (Zero Flag)
    agregarLog("ALU Store: Nuevo AX = " + resultado.toString(16).toUpperCase());
  } else if (ir === "3B") { 
    // Comparación lógica (CMP)
    hoja.getRange("C14").setValue((ax === bx) ? "1" : "0"); // ZF
    hoja.getRange("C16").setValue((ax < bx) ? "1" : "0");   // SF
    agregarLog("ALU: Comparación ejecutada (ZF y SF actualizadas)");
  }
  
  hoja.getRange("G8:G9").setValue("Completado").setFontColor("#777777").setFontWeight("normal");
}
// =========================================================
// CONTROLES DE LA CPU - ISSUE 4
// =========================================================


// Botón RESET: Restaura los registros, banderas y la Memoria RAM a cero
function resetCPU() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Restaurar registros a 00
  setRegistro("C6", "00"); // PC
  setRegistro("C7", "00"); // MAR
  setRegistro("C8", "00"); // MDR
  setRegistro("C9", "00"); // IR
  setRegistro("C10", "00"); // AX
  setRegistro("C11", "00"); // BX
  
  // Restaurar Banderas
  hoja.getRange("C14:C16").setValue("0"); // ZF, CF, SF
  
  // Limpiar indicadores visuales del reloj
  hoja.getRange("G6:G9").setValue("Pendiente").setFontColor("#777777").setFontWeight("normal");
  
  // NUEVO: Limpiar Memoria RAM (Rellena todo el mapa con "00")
  hoja.getRange("J7:Y22").setValue("00");
  
  agregarLog("=== SISTEMA REINICIADO (CPU Y RAM A CERO) ===");
}

// Botón LOAD: Carga un mini-programa automáticamente para no escribir a mano
function loadProgram() {
  resetCPU(); // Limpia antes de cargar
  
  // Escribimos 3 instrucciones "A5" seguidas y luego un "00"
  writeRAM("00", "A5"); // INC AX
  writeRAM("01", "A5"); // INC AX
  writeRAM("02", "A5"); // INC AX
  writeRAM("03", "00"); // NOP / HLT
  
  agregarLog("Programa de prueba cargado en RAM.");
}
// =========================================================
// MODO PASO A PASO (STEP) Y CONTINUO (RUN) - ISSUE 4
// =========================================================

// Función auxiliar para reiniciar los textos de las fases
function resetFasesVisuales() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  hoja.getRange("G6:G9").setValue("Pendiente").setFontColor("#777777").setFontWeight("normal");
}

// Botón STEP: Avanza exactamente una fase del ciclo a la vez
function ejecutarStep() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  var estadoFetch = hoja.getRange("G6").getValue();
  var estadoDecode = hoja.getRange("G7").getValue();
  var estadoExecute = hoja.getRange("G8").getValue();
  
  // Máquina de estados simple leyendo el panel central
  if (estadoFetch === "Pendiente") {
    ejecutarFetch();
  } else if (estadoFetch === "Completado" && estadoDecode === "Pendiente") {
    ejecutarDecode();
  } else if (estadoDecode === "Completado" && estadoExecute === "Pendiente") {
    ejecutarExecute();
  } else if (estadoExecute === "Completado") {
    // Si ya terminó el ciclo anterior, reinicia las luces y empieza el nuevo Fetch
    resetFasesVisuales();
    ejecutarFetch();
  }
}

// Botón RUN: Ejecuta ciclos completos de forma automática (Actualizado con sensor de pausa)
function ejecutarRun() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var velocidad = 800; // Retardo en milisegundos
  
  // Escribimos la etiqueta de estado en la celda G10
  hoja.getRange("F10").setValue("ESTADO:").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("right");
  hoja.getRange("G10").setValue("RUNNING").setFontColor("#00ff00").setFontWeight("bold");
  
  agregarLog(">>> INICIANDO MODO CONTINUO (RUN) <<<");
  
  // Aumentamos el límite a 20 instrucciones, pero con freno de seguridad
  for (var i = 0; i < 20; i++) {
    
    // SENSOR DE PAUSA: El procesador lee si tocaste el botón PAUSE
    var estado = hoja.getRange("G10").getValue();
    if (estado === "PAUSADO") {
      agregarLog("⏸️ Reloj pausado por el usuario.");
      break; // Rompe el bucle y se detiene
    }
    
    var ir = getRegistro("C9");
    
    // SENSOR DE PARADA (HLT)
    if (ir === "00" && hoja.getRange("G6").getValue() === "Completado") {
      agregarLog("HLT detectado. Reloj detenido.");
      break; 
    }
    
    ejecutarStep();
    SpreadsheetApp.flush(); 
    Utilities.sleep(velocidad); 
  }
  
  // Al terminar o pausar, actualiza el estado
  if (hoja.getRange("G10").getValue() !== "PAUSADO") {
    hoja.getRange("G10").setValue("DETENIDO").setFontColor("#ff0000");
  }
}

// Botón PAUSE: Activa la bandera de pausa para que el ciclo RUN se detenga
function pausarCPU() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  hoja.getRange("G10").setValue("PAUSADO").setFontColor("#ff9900").setFontWeight("bold");
}
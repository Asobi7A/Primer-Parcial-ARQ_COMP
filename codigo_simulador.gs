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

// --- FASE 2: DECODE (Decodificación) ---
function ejecutarDecode() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Encender indicador de fase
  hoja.getRange("G7").setValue("ACTIVO 🟢").setFontColor("#00ff00").setFontWeight("bold");
  agregarLog("Iniciando fase DECODE...");
  
  var ir = getRegistro("C9");
  var instruccionDecodificada = "";
  
  // Mini-diccionario (El comienzo de nuestra ISA)
  switch(ir) {
    case "A5": 
      instruccionDecodificada = "INC AX (Incrementar Acumulador)"; 
      break;
    case "00": 
      instruccionDecodificada = "NOP (Ninguna operación)"; 
      break;
    default: 
      instruccionDecodificada = "Instrucción desconocida";
  }
  
  agregarLog("Unidad de Control: Código " + ir + " interpretado como -> " + instruccionDecodificada);
  
  // Apagar indicador
  hoja.getRange("G7").setValue("Completado").setFontColor("#777777").setFontWeight("normal");
}

// --- FASE 3 y 4: EXECUTE & STORE (Ejecución y Almacenamiento) ---
function ejecutarExecute() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Encender indicador de fase Execute
  hoja.getRange("G8").setValue("ACTIVO 🟢").setFontColor("#00ff00").setFontWeight("bold");
  agregarLog("Iniciando fase EXECUTE y ALU...");
  
  var ir = getRegistro("C9");
  
  if (ir === "A5") { 
    // Lógica para INC AX
    var axStr = getRegistro("C10"); // Lee AX actual
    var ax = parseInt(axStr, 16);
    
    ax = (ax + 1) % 256; // La ALU suma 1 (evitando desbordamiento)
    
    // FASE 4: STORE (Guardar el resultado)
    hoja.getRange("G9").setValue("ACTIVO 🟢").setFontColor("#00ff00").setFontWeight("bold");
    setRegistro("C10", ax); // Escribe el nuevo valor en AX
    
    // Actualización de Banderas (Zero Flag)
    var zf = (ax === 0) ? "1" : "0";
    hoja.getRange("C14").setValue(zf); 
    
    agregarLog("ALU: Se sumó 1 a AX. Nuevo valor = " + ax.toString(16).toUpperCase());
    agregarLog("STORE: Banderas actualizadas (ZF=" + zf + "). Fin de instrucción.");
  } else {
    agregarLog("ALU: Operación ignorada o no implementada.");
  }
  
  // Apagar indicadores
  hoja.getRange("G8").setValue("Completado").setFontColor("#777777").setFontWeight("normal");
  hoja.getRange("G9").setValue("Completado").setFontColor("#777777").setFontWeight("normal");
  agregarLog("--- ESPERANDO SIGUIENTE CICLO ---");
}
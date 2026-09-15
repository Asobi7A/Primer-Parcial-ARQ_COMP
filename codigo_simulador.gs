/**
 * ISSUE 2: INTERFAZ GAMIFICADA - REGISTROS, BANDERAS Y MEMORIA
 */

function inicializarJuegoCPU() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  hoja.clear();
  hoja.setHiddenGridlines(true); // <--- Línea corregida
  hoja.getRange("A1:Z50").setBackground("#1e1e1e"); // Fondo oscuro general

  // --- TÍTULO Y CONTROLES ---
  hoja.getRange("B2:X3").merge().setValue("⚡ SIMULADOR CPU x86 - ARQUITECTURA DE 8 BITS ⚡")
    .setFontWeight("bold").setFontSize(16).setFontColor("#00ffcc")
    .setHorizontalAlignment("center").setVerticalAlignment("middle");
  
  // --- PANEL IZQUIERDO: HUD DE LA CPU (Registros) ---
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

  // Banderas (Flags)
  hoja.getRange("B13:D13").merge().setValue("🚩 BANDERAS DE ESTADO (FLAGS)")
    .setBackground("#880000").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
  var banderas = [["ZF (Zero)", "0"], ["CF (Carry)", "0"], ["SF (Sign)", "0"]];
  hoja.getRange("B14:C16").setValues(banderas).setFontColor("white").setBorder(true, true, true, true, true, true, "#555555", null);
  hoja.getRange("C14:C16").setBackground("#000000").setFontColor("#ff0055").setFontWeight("bold").setHorizontalAlignment("center");

  // --- PANEL CENTRAL: CICLO DE INSTRUCCIÓN ---
  hoja.getRange("F5:G5").merge().setValue("🔄 CICLO DE RELOJ").setBackground("#005588").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
  var fases = [
    ["1. FETCH", "Pendiente"],
    ["2. DECODE", "Pendiente"],
    ["3. EXECUTE", "Pendiente"],
    ["4. STORE", "Pendiente"]
  ];
  hoja.getRange("F6:G9").setValues(fases).setFontColor("white").setBorder(true, true, true, true, true, true, "#555555", null);
  hoja.getRange("G6:G9").setFontColor("#777777").setHorizontalAlignment("center"); 

  // --- PANEL DERECHO: MEMORIA RAM (El Mapa) ---
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

  // --- PANEL INFERIOR: LOG DE MICRO-OPERACIONES ---
  hoja.getRange("B18:G18").merge().setValue("📜 LOG DE MICRO-OPERACIONES")
    .setBackground("#333333").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
  hoja.getRange("B19:G22").merge().setBackground("#000000").setFontColor("#00ff00").setFontFamily("Courier New").setVerticalAlignment("top");
  hoja.getRange("B19").setValue("> Sistema inicializado...\n> Esperando cargar programa...");
}
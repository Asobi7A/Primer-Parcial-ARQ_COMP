/**
 * ISSUE 1: ARQUITECTURA DE MEMORIA PRINCIPAL Y SUBRUTINAS
 */

function inicializarMemoria() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  hoja.clear();

  // --- 1. MATRIZ DE MEMORIA (16x16) ---
  hoja.getRange("B2:R2").merge().setValue("MEMORIA PRINCIPAL (RAM 256 Bytes)").setFontWeight("bold").setBackground("#1c4587").setFontColor("white").setHorizontalAlignment("center");
  
  var columnas = [["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]];
  hoja.getRange("C3:R3").setValues(columnas).setBackground("#4a86e8").setFontColor("white").setHorizontalAlignment("center").setFontWeight("bold");

  for (var i = 0; i < 16; i++) {
    var filaHex = i.toString(16).toUpperCase() + "0";
    hoja.getRange(4 + i, 2).setValue(filaHex).setBackground("#4a86e8").setFontColor("white").setHorizontalAlignment("center").setFontWeight("bold");
    
    for (var j = 0; j < 16; j++) {
      // Inicializa en "00" (8 bits)
      hoja.getRange(4 + i, 3 + j).setValue("00").setHorizontalAlignment("center").setFontFamily("Courier New");
    }
  }
  
  hoja.getRange("B3:R19").setBorder(true, true, true, true, true, true);
  hoja.setColumnWidths(3, 16, 40);

  // --- 2. INSPECTOR Y SEGMENTACIÓN ---
  hoja.getRange("T3:U3").merge().setValue("INSPECTOR DE MEMORIA").setBackground("#e69138").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
  
  var etiquetasInspector = [
    ["Dirección Activa:", ""],
    ["Hexadecimal (8 bits):", ""],
    ["Binario:", ""],
    ["Decimal:", ""]
  ];
  hoja.getRange("T4:U7").setValues(etiquetasInspector).setBorder(true, true, true, true, true, true);
  hoja.getRange("T4:T7").setFontWeight("bold").setBackground("#fce5cd");
  
  // Segmentación visual de Código y Datos
  hoja.getRange("T9").setValue("Segmento de Código: 00h - 7Fh").setBackground("#d9ead3").setFontWeight("bold");
  hoja.getRange("T10").setValue("Segmento de Datos: 80h - FFh").setBackground("#cfe2f3").setFontWeight("bold");
  hoja.autoResizeColumn(20);
}

// --- 3. SUBRUTINAS PRIMITIVAS ---

function writeRAM(direccionHex, valorHex) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var decDir = parseInt(direccionHex, 16);
  var fila = Math.floor(decDir / 16) + 4;
  var col = (decDir % 16) + 3;
  
  var valorFormateado = ("00" + valorHex.toString(16).toUpperCase()).slice(-2);
  hoja.getRange(fila, col).setValue(valorFormateado);
  
  actualizarInspector(direccionHex, valorFormateado);
}

function readRAM(direccionHex) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var decDir = parseInt(direccionHex, 16);
  var fila = Math.floor(decDir / 16) + 4;
  var col = (decDir % 16) + 3;
  
  var valor = hoja.getRange(fila, col).getValue();
  actualizarInspector(direccionHex, valor.toString());
  return valor;
}

function actualizarInspector(direccionHex, valorHex) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var valorDec = parseInt(valorHex, 16);
  var valorBin = ("00000000" + valorDec.toString(2)).slice(-8);
  
  hoja.getRange("U4").setValue(direccionHex.toUpperCase());
  hoja.getRange("U5").setValue(valorHex.toUpperCase());
  hoja.getRange("U6").setValue(valorBin);
  hoja.getRange("U7").setValue(valorDec);
}
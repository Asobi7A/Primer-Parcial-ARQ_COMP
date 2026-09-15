#  Simulador de CPU x86 - Arquitectura de 8 Bits

**Autor:** Eito Ygei Matsui  
**Materia:** Arquitectura de Computadoras  
**Docente:** Ing. Loayza  

## 📝 Descripción del Proyecto
Este proyecto es un simulador interactivo de una CPU de arquitectura de Von Neumann de 8 bits, desarrollado íntegramente sobre **Google Sheets** 
utilizando **Google Apps Script**. 

El simulador renderiza un HUD (Head-Up Display) gamificado que permite visualizar en tiempo real el flujo de datos a través del **Ciclo de Instrucción** 
(Fetch, Decode, Execute, Store), actualizando dinámicamente los registros de la CPU, las banderas de estado (Flags) y la memoria principal (RAM de 256 bytes).

##  Set de Instrucciones (ISA) Implementado

El procesador es capaz de procesar un set reducido de instrucciones (Turing completo), soportando operaciones aritméticas, lógicas y control de flujo
(saltos condicionales e incondicionales).

| Opcode (Hex) | Mnemónico | Descripción | Fase de Ejecución (ALU) |
| :---: | :--- | :--- | :--- |
| **00** | `HLT` | Detiene el reloj del sistema. | N/A |
| **01** | `ADD AX, BX` | Suma el contenido de BX a AX. | `AX <- AX + BX` |
| **02** | `SUB AX, BX` | Resta el contenido de BX a AX. | `AX <- AX - BX` |
| **3B** | `CMP AX, BX` | Compara AX y BX. Actualiza ZF y SF. | Lógica Interna |
| **8B** | `MOV AX, BX` | Copia el valor de BX en AX. | `AX <- BX` |
| **A5** | `INC AX` | Incrementa el valor de AX en 1. | `AX <- AX + 1` |
| **E0** | `JMP [Dir]` | Salto incondicional a la dirección especificada. | `PC <- Dir` |
| **E1** | `JZ [Dir]` | Salta a la dirección si Zero Flag (ZF) es 1. | `Si ZF=1, PC <- Dir` |

##  Guía de Interfaz y Controles

El panel cuenta con una botonera interactiva que permite el control absoluto del reloj del sistema:

*   **LOAD:** Inyecta automáticamente el programa de demostración en la RAM y prepara el registro BX.
*   **STEP:** Ejecuta el ciclo de reloj paso a paso (avanza exactamente una fase por clic).
*   **RUN:** Inicia la ejecución secuencial automática a una velocidad controlada (800ms por fase).
*   **PAUSE:** Interrumpe la ejecución del modo RUN de manera segura.
*   **RESET:** Limpia completamente la memoria RAM, los registros (PC, MAR, MDR, IR, AX, BX) y las banderas de estado.

##  Programa de Demostración (Bucle)

Al utilizar el botón **LOAD**, el simulador carga un bucle condicional diseñado para demostrar el control de flujo. 
El programa precarga el registro `BX` con el valor `03`. Luego, la CPU compara el acumulador `AX` con `BX` (`CMP`). Si no son iguales, incrementa `AX` 
(`INC`) y salta hacia atrás (`JMP`). Cuando `AX` alcanza el valor `03`, la bandera de cero (`ZF`) se enciende, activando el salto condicional (`JZ`) que 
rompe el bucle y dirige el PC hacia la instrucción de parada (`HLT`).

## ⚙️ Gestión de Proyecto
El desarrollo de este simulador siguió una estricta metodología de control de versiones semántico a través de Git y se organizó mediante un tablero
**Kanban** (GitHub Projects), dividiendo la entrega en *Issues* trazables desde la construcción de la matriz de memoria hasta la implementación de la ALU.

#define ledColorRojo            0x12
#define ledColorVerde           0x22
#define ledColorAmarillo        0x32

void MainWindow::envioMensajePanelLed2(int tipoMensaje, int nEspacios){

    char tramaPanel[128];
    char tramaPanel_2[128];
    unsigned char tramaAUx2 = 0;
    unsigned char auxColor = 0;
    unsigned char color = 0;
    QString mensaje;
    QString mensaje2;

    if(tipoMensaje == 0 ){
        mensaje2.clear();
        color = 0x22; //0x22
        auxColor = ledColorVerde;
        //cntPlazasDisponiblesPLed= nEspacios;
        d = "LIBRES  ";
        mensaje2.append(QString::number(parqPuestosDisp-parqPuestosUtilizados));
    }else if(tipoMensaje ==1){
        mensaje2.clear();
        color = 0x22; //0x22
        auxColor = ledColorVerde;
        //cntPlazasDisponiblesPLed= nEspacios;
        mensaje2 = "LIBRES  ";
        mensaje2.append(QString::number(parqPuestosDisp-parqPuestosUtilizados));
    }else if(tipoMensaje==2){
        mensaje2.clear();
        auxColor = ledColorVerde;
        color = 0x22; //0x22
        //cntPlazasDisponiblesPLed= nEspacios;
        mensaje2 = "LIBRES  ";
        mensaje2.append(QString::number(parqPuestosDisp-parqPuestosUtilizados));
    }
    parqLibres = parqPuestosDisp-parqPuestosUtilizados;
    if (parqLibres<=0){
        color = 0x12;
        auxColor = ledColorRojo;

    }



    unsigned char auxDatoColor =0; // Verde 152, Rojo 136, Amarillo 168

    if(auxColor == ledColorRojo){
        auxDatoColor = 136;
    }else if(auxColor == ledColorVerde){
        auxDatoColor = 152;
    }else if(auxColor == ledColorAmarillo){
        auxDatoColor = 168;
    }
    QByteArray mensajeArray = mensaje2.toLocal8Bit();
    unsigned int LenMensaje = mensaje2.length();
    // Genero Longitud Trama
    unsigned int lenTramaPackettoChecksm = 9 + LenMensaje + 12;
    qDebug() << "lenTramaPackettoChecksm" <<lenTramaPackettoChecksm<<endl;

    //Escribo la longitud del paquete
    unsigned int lenPacket = LenMensaje*3 + 10;
    qDebug() << "lenPacket" <<lenPacket<<endl;

    tramaPanel_2[0] = 0xa5; // ID code B1
    tramaPanel_2[1] = 0x30; // ID code B2
    tramaPanel_2[2] = 0x30; // ID code B3
    tramaPanel_2[3] = 0x36; // ID code B4
    tramaPanel_2[4] = 0x30; ; //0x30;
    tramaPanel_2[5] = 0x36;
    tramaPanel_2[6] = 0x65;
    tramaPanel_2[7] = 0x64;
    tramaPanel_2[8] = 0x35;
    tramaPanel_2[9] = 0x64;
    tramaPanel_2[10] = 0x35;
    tramaPanel_2[11] = 0x32;
    tramaPanel_2[12] = 0x32;
    tramaPanel_2[13] = 0x00;
    tramaPanel_2[14] = 0x68; // Packet Type
    tramaPanel_2[15] = 0x32; // Card Type
    tramaPanel_2[16] = 0xff; //Card ID
    tramaPanel_2[17] = 0x74; //CMD CODE - Protocol CODE
    tramaPanel_2[18] = 0x11;
    tramaPanel_2[19] = 0x00;
    tramaPanel_2[20] = 0x00;
    tramaPanel_2[21] = 0x00;
    tramaPanel_2[22] = 0x00;
    tramaPanel_2[23] = 22+LenMensaje; //
    tramaPanel_2[24] = 0x00;
    tramaPanel_2[25] = 0x77;
    tramaPanel_2[26] = 0x00;
    tramaPanel_2[27] = LenMensaje + auxDatoColor;//0xb2;

    tramaPanel_2[28] = 0x03;
    tramaPanel_2[29] = 0x00;
    tramaPanel_2[30] = 0x00;
    tramaPanel_2[31] = 0x00;
    tramaPanel_2[32] = 0x00;
    tramaPanel_2[33] = 0x00;
    tramaPanel_2[34] = 0x60;
    tramaPanel_2[35] = 0x00;
    tramaPanel_2[36] = 0x10;
    tramaPanel_2[37] = auxColor;
    tramaPanel_2[38] = 0x00;
    tramaPanel_2[39] = 0x00;
    tramaPanel_2[40] = 0x00;
    tramaPanel_2[41] = 0x00;
    tramaPanel_2[42] = 0x00;
    tramaPanel_2[44] = 0x03;
    tramaPanel_2[45] = 0x00;
    tramaPanel_2[46] = LenMensaje; // Longitud del paquete
    unsigned int datoInicial2 = 47; // Desde aqui packet data
    for (unsigned int cntAux = 0; cntAux < LenMensaje; cntAux++) {
        tramaPanel_2[datoInicial2+cntAux] = mensajeArray[cntAux];
    }
    //Saco el checksum
    unsigned int checkSumDEC = 0;
    for (unsigned int cntAux2 = 14; cntAux2 <= (datoInicial2+LenMensaje)-1; cntAux2++) {
       tramaAUx2 = tramaPanel_2[cntAux2];
       checkSumDEC = checkSumDEC + tramaAUx2; //1539
    }
    qDebug() << "checkSumDEC "<<checkSumDEC<<endl;
    int CSLB =  (checkSumDEC & 0xFF00)>>8;
    int CSHB =  (checkSumDEC & 0b0000000011111111);


    tramaPanel_2[datoInicial2+LenMensaje] = CSHB; // estan en 3c --- mensajeArray[LenMensaje-1]
    tramaPanel_2[datoInicial2+LenMensaje+1] = CSLB; // b1 check SUm de Packet Type a  Packet dataLower byte primero
    tramaPanel_2[datoInicial2+LenMensaje+2] = 0xae; // constante, final del paquete


    lenTramaPanelLed_2 = datoInicial2 + LenMensaje + 3;
   

    tcpSocketClientePanel->abort();
    tcpSocketClientePanel->connectToHost("10.45.60.13", 5200);

    tcpSocketClientePanel->waitForConnected(500); //5000
    if(tcpSocketClientePanel->state() == QAbstractSocket::ConnectedState && tcpSocketClientePanel_is_connected) {
        tcpSocketClientePanel->write(&tramaPanel_2[0],lenTramaPanelLed_2);
        tcpSocketClientePanel->flush();
    }
    tcpSocketClientePanel->abort();

}// Fin funcion test
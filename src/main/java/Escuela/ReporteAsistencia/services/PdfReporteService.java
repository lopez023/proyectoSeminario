package Escuela.ReporteAsistencia.services;


import Escuela.ReporteAsistencia.models.Asistencias;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfReporteService {

    public ByteArrayInputStream generarPdfAsistencia(List<Asistencias> asistencias, String tituloReporte) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Título del Reporte
            Font fontTitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLUE);
            Paragraph titulo = new Paragraph(tituloReporte, fontTitulo);
            titulo.setAlignment(Element.ALIGN_CENTER);
            document.add(titulo);
            document.add(new Paragraph(" ")); // Espacio en blanco

            // Tabla de datos (Estudiante, Fecha, Hora, Estado, Comentario)
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{3f, 2f, 2f, 2f, 3f});

            // Encabezados de la tabla
            String[] headers = {"Estudiante", "Fecha", "Hora", "Estado", "Comentario"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
                cell.setBackgroundColor(Color.LIGHT_GRAY);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            // Filas con los registros de asistencia
            for (Asistencias a : asistencias) {
                String nombreCompleto = a.getEstudiante().getNombre() + " " + a.getEstudiante().getPrimerApellido() + " " + a.getEstudiante().getSegundoApellido();
                table.addCell(nombreCompleto);
                table.addCell(a.getFecha().toString());
                table.addCell(a.getHora().toString());
                table.addCell(a.getEstado().name());
                table.addCell(a.getComentario() != null ? a.getComentario() : "-");
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Error al generar el PDF: " + e.getMessage());
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}

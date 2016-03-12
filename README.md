# ProcessWireImageLink (working title)

# ProcessWireImageLink (Arbeitstitel)

ImageLink ist ein ProcessWire-Modul\*) in einem sehr frühen Entwicklungsstadium (proof of concept). Es addressiert den Bedarf nach einem atomaren Feld, mit dem eine Referenz auf ein in einem Image-Feld hinterlegtes Bild hergestellt werden kann, ähnlich wie es das Konzept des Page-Feldes für Seiten vorsieht\**). Anwendungsfälle ergeben sich daraus, dass das einzige aktuell vorhandene Feld für Bildcontainer seitenbasiert ist und etwaige Mehrfachverwendung von Bildern mit der Duplizierung von Uploads und physischen Bildinstanzen einher geht.
Der einzige bisher mögliche Weg, Bilder nicht redundant zu nutzen, bestand in der Verwendung eines Rich-Text-Feldes wie CKEditor. Diese Felder sind aber nicht atomar sondern darauf ausgerichtet, Bilder im Kontext von anderen Elementen, insbesondere Text, zu betrachten. Desweiteren ist Rich-Text Backend-seitig ein komplexes Eingabefeld. Größte Hürde ist jedoch das Format, in dem RTE die Eingabe speichern: in fertigem Markup (i.d.R. HTML). Damit lassen sich die erzielten Bilddateien nicht direkt ansprechen und im Sinne der vorhandenen API von ProcessWire atomar nutzen.

## Nutzungsszenarien ##

* als Referenz auf ein Bild in einem anderen Seitenkontext
  * z.B. Vorhalten globaler Image-Archive in speziellen Seiten
  * Organisation zentraler Bildinhalte, die mehrfach verwendet werden 
    * Logos, 
    * Titelgrafiken, 
    * Trust Symbole, 
    * Autorenprofile
* innerhalb von Repeatern oder komplexen Eingabeszenarien
* als Bildreferenz, die API-seitig weiterverarbeitet werden soll
  * automatisches Cropping von Titelgrafiken
  * Vorschaubild-Auswahl aus mehreren Artikelbildern
* Schaffung von Eingabefeldern für Responsive images
* Einbindung von Symbolbildern in verschiedenen Kontexten 
* Wiederverwendung von Fotos in Galerien o.ä.

## Hinweise

**) Im Gegensatz zu Pages werden Bilder in ProcessWire nicht unter einer ID, sondern durch eine konventionelle Bestimmung (Page-ID, Dateiname, Operationen als Dateinamensergänzung) verwaltet. Daher nutzt ImageLink derzeit ein JSON-Format, um alle nötigen Informationen in der Datenbank abzulegen. Das ist einerseits beliebig erweiterbar, andererseits nicht so atomar, wie es ProcessWire anderswo vor macht. Das verwendete Speicherformat steht deshalb noch zur Disposition.
Generell ist das vorliegende Modul eine Machbarkeitsstudie. Wie weit und wohin es weiterentwickelt wird, ist aktuelle nicht definiert.

## Referenzen

*) ProcessWire ist ein geniales CMS mit einer starken API. SOlltest Du es nicht kennen, lerne es kennen: https://processwire.com

Felder zur Bildreferenzierung wurden in diesem Forumthema auf der Wunschliste diskutiert: https://processwire.com/talk/topic/10009-image-field-select-image-from-another-page/ Dort finden sich auch animierte Gifs, die den aktuellen Funktionsstand demonstrieren.

package fr.epita.assistants.ping.utils;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class Logger {

    private static final DateTimeFormatter TS =
            DateTimeFormatter.ofPattern("dd/MM/yy - HH:mm:ss");

    private static final String LOG_FILE       = System.getenv("LOG_FILE");
    private static final String ERROR_LOG_FILE = System.getenv("ERROR_LOG_FILE");

    public static void info (String fmt, Object... a){ write("INFO",  LOG_FILE,  fmt,a); }
    public static void debug(String fmt, Object... a){ write("DEBUG", LOG_FILE,  fmt,a); }
    public static void warn (String fmt, Object... a){ write("WARN",  LOG_FILE,  fmt,a); }
    public static void error(String fmt, Object... a){ write("ERROR", ERROR_LOG_FILE, fmt,a); }

    private static void write(String level, String file, String fmt, Object... a){
        String msg  = (a.length==0) ? fmt : String.format(fmt, a);
        String line = String.format("[%s] %s %s",
                LocalDateTime.now().format(TS), level, msg);

        if (file != null && !file.isBlank()){
            try(FileWriter fw = new FileWriter(file, true);
                PrintWriter pw = new PrintWriter(fw)){
                pw.println(line);
                return;
            }catch(IOException ignored){}
        }
        System.out.println(line);
    }

    private Logger(){}
}
/**
 * Dave Toth (Adapted from Sun's Java Tutorial code)
 * This program is the client portion of a client-server pair.
 */

import java.io.*;
import java.net.*;

public class MyClient {

  public static void main(String[] args) throws IOException {

    Socket mySocket = null;
    PrintWriter out = null;
    BufferedReader in = null;


    try {
      mySocket = new Socket("localhost", 1337);
      out = new PrintWriter(mySocket.getOutputStream(), true);
      in = new BufferedReader(new InputStreamReader(mySocket.getInputStream()));
      attachShutDownHook(out);
    } 
    catch (UnknownHostException e) {
      System.err.println("I couldn't find the host rosemary.umw.edu.");
      System.exit(1);
    } 
    catch (IOException e) {
      System.err.println("I/O exception with rosemary.umw.edu.");
      System.err.println(e);
      System.exit(1);
    }
    
    boolean gameOn = false;
    while(!gameOn) {
      System.out.println("Ready to play? (y/n)");
      String line = getUserIn();
      if(line.equals("y")) {
        gameOn = true;
      }


      while(gameOn) {
        String fromServer;
        boolean playing = true;
        while(playing) {
          fromServer = in.readLine();
          System.out.println(fromServer);
          String response = getUserIn();
          out.println(response);
        }
        gameOn = false;
      }
    }
    System.out.println("closing socket!!!!!"); 
    out.close();
    in.close();
    mySocket.close();
  }

  private static String getUserIn() {
    try {
      BufferedReader userIn = new BufferedReader(new InputStreamReader(System.in));
      return userIn.readLine();
    } catch(Exception e) {
      System.err.println("Error!");
      System.err.println(e);
    }
    return "Error";
  }
  
  //Code adapted from http://hellotojavaworld.blogspot.com/2010/11/runtimeaddshutdownhook.html
  public static void attachShutDownHook(PrintWriter output) {
    final PrintWriter out = output;
    Runtime.getRuntime().addShutdownHook(new Thread() {
      @Override
      public void run() {
        out.println("quit:quit");
      }
    });
    System.out.println("added");
  }
}

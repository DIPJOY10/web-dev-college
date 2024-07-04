import java.util.*;
import java.io.*;
public class codeforces{
    public static void main(String args[])throws IOException{
        BufferedReader br=new BufferedReader(new InputStreamReader(System.in));
        int T=Integer.parseInt(br.readLine());
        while(T-->0){
            int N=Integer.parseInt(br.readLine());
            String s=br.readLine().trim();
            int count1=0,count2=0,p1=0,p2=1;
            for(int i=0;i<N;i++){
              int c=s.charAt(i)-'0';
              if(c!=p1)count1++;
              else count2++;
              p1=1;p2=0;
            }
            System.out.println(Math.min(count1,count2));

        }
    }
}
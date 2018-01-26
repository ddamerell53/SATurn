/*
* SATURN (Sequence Analysis Tool - Ultima regula natura)
* Written in 2018 by David Damerell <david.damerell@sgc.ox.ac.uk>, Claire Strain-Damerell <claire.damerell@sgc.ox.ac.uk>, Brian Marsden <brian.marsden@sgc.ox.ac.uk>
*
* To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this
* software to the public domain worldwide. This software is distributed without any warranty. You should have received a
* copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
*/

package saturn.client.programs.phylo5;

class Phylo5Math{

    static public function degreesToRadians (a:Float):Float{
        return a*(Math.PI/180);
    }

    static public function radiansToDegrees (b:Float):Float{
        return b*(180/Math.PI);
    }

    static public function getMaxOfArray (a:Array<Float>):Float{

        var i:Int;
        var n:Float;
        n=a[0];
        for (i in 1...a.length){
            if(n<a[i])  n=a[i];
        }
        return n;
    }
}
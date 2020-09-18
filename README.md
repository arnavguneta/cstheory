## CS Theory
### Union and Intersection of DFAs
### Arnav Guneta

#### Description
Given 2 DFAs, the script can compute their union or intersection.

#### Purpose
To make life easier.

#### File details
doc.graf – input file for DFAs in grafstate format

#### Usage:
In a separate file, put the operation [union/intersect] at the top followed by the grafstate format for 2 DFAs.

Change the file variable to your filename at line 12. By default its 'doc.graf'.

Run the script using `node dfas.js` (or any other way to compile js).

The resulting DFA will be appened to the input file in grafstate format.

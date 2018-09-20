import pandas as pd

class Note:
    def __init__(self, name, octave):
        
        df = pd.read_csv('notes.csv')
        df.set_index('name', inplace=True)
        
        self.__note_dict = df.to_dict()['number']
        print(self.__note_dict)
        
        self.__sequence = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
        self.note_name = name
        self.octave = octave
        
        if self.__sequence.index(name) > 4:
            self._note_num = self.__note_dict[name] + (12 * (octave))
        else:
            self._note_num = self.__note_dict[name] + (12 * (octave - 1))
            
                    
    def move_note(self, interval):
        pass
        
    def __str__(self):
        return self.note_name + str(self.octave)
        
class Interval:
    def __init__(self, interval):
        
        df = pd.read_csv('intervals.csv')
        df.set_index('name', inplace=True)
        
        self.__interval_dict = df.to_dict()['half_steps']
        self.interval_name = interval
        self.half_steps = self.__interval_dict[interval]

    
class Scale:
    def __init__(self, key, tonality):
        self.key = key
        self.tonality = tonality
        self.notes = []

    def derive_notes(self):
        W = 2
        H = 1

        major = 'WWHWWWH'
        minor = 'WHWWHWH'
        
    
a = Note('F#', 4)
print(a)
print(a._note_num)
def judge_two_dicts(d1, d2):
    cks = d1.keys() & d2.keys()
    if len(cks) == len(d1) and len(cks) == len(d2):
        print()
    pass